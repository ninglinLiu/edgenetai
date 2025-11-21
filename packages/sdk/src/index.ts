/**
 * @package @edgenetai/sdk
 * @description Client SDK for EdgeNet.AI - Contract interactions and utilities
 */

import { createPublicClient, createWalletClient, http, type Address, type Hash } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { anvil, sepolia } from 'viem/chains';
import type { Receipt } from '@edgenetai/proto';

// Contract ABI (minimal for receipts)
const INFERENCE_RECEIPT_ABI = [
  {
    type: 'function',
    name: 'emitReceipt',
    inputs: [
      { name: 'jobId', type: 'bytes32' },
      { name: 'modelHash', type: 'bytes32' },
      { name: 'latencyMs', type: 'uint256' },
      { name: 'nodeSetRoot', type: 'bytes32' },
      { name: 'ipfsCID', type: 'string' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getReceipt',
    inputs: [{ name: 'jobId', type: 'bytes32' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'jobId', type: 'bytes32' },
          { name: 'modelHash', type: 'bytes32' },
          { name: 'latencyMs', type: 'uint256' },
          { name: 'nodeSetRoot', type: 'bytes32' },
          { name: 'verifier', type: 'address' },
          { name: 'ipfsCID', type: 'string' },
          { name: 'blockNumber', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'hasReceipt',
    inputs: [{ name: 'jobId', type: 'bytes32' }],
    outputs: [{ name: 'exists', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'ReceiptEmitted',
    inputs: [
      { name: 'jobId', type: 'bytes32', indexed: true },
      { name: 'modelHash', type: 'bytes32' },
      { name: 'latencyMs', type: 'uint256' },
      { name: 'nodeSetRoot', type: 'bytes32' },
      { name: 'verifier', type: 'address', indexed: true },
      { name: 'ipfsCID', type: 'string' },
    ],
  },
] as const;

export interface SDKConfig {
  rpcUrl: string;
  chainId: number;
  contractAddress: Address;
  privateKey?: `0x${string}`; // Optional, for write operations
}

/**
 * EdgeNet SDK for contract interactions
 */
export class EdgeNetSDK {
  private publicClient;
  private walletClient;
  private contractAddress: Address;
  private account;

  constructor(config: SDKConfig) {
    const chain = config.chainId === 31337 ? anvil : sepolia;

    this.contractAddress = config.contractAddress;
    this.publicClient = createPublicClient({
      chain,
      transport: http(config.rpcUrl),
    });

    if (config.privateKey) {
      this.account = privateKeyToAccount(config.privateKey);
      this.walletClient = createWalletClient({
        account: this.account,
        chain,
        transport: http(config.rpcUrl),
      });
    }
  }

  /**
   * Emit a receipt on-chain (only callable by verifier)
   */
  async emitReceipt(params: {
    jobId: string;
    modelHash: string;
    latencyMs: number;
    nodeSetRoot: string;
    ipfsCID?: string;
  }): Promise<Hash> {
    if (!this.walletClient || !this.account) {
      throw new Error('SDK: privateKey required for write operations');
    }

    const jobIdBytes = this.stringToBytes32(params.jobId);
    const modelHashBytes = this.stringToBytes32(params.modelHash);
    const nodeSetRootBytes = this.stringToBytes32(params.nodeSetRoot);

    const hash = await this.walletClient.writeContract({
      address: this.contractAddress,
      abi: INFERENCE_RECEIPT_ABI,
      functionName: 'emitReceipt',
      args: [
        jobIdBytes,
        modelHashBytes,
        BigInt(params.latencyMs),
        nodeSetRootBytes,
        params.ipfsCID || '',
      ],
    });

    return hash;
  }

  /**
   * Get receipt from chain
   */
  async getReceipt(jobId: string): Promise<Receipt | null> {
    const jobIdBytes = this.stringToBytes32(jobId);

    const receipt = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: INFERENCE_RECEIPT_ABI,
      functionName: 'getReceipt',
      args: [jobIdBytes],
    });

    if (receipt.jobId === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      return null;
    }

    return {
      jobId: this.bytes32ToString(receipt.jobId),
      modelHash: this.bytes32ToString(receipt.modelHash),
      latencyMs: Number(receipt.latencyMs),
      nodeSetRoot: this.bytes32ToString(receipt.nodeSetRoot),
      verifierSig: receipt.verifier,
      ipfsCID: receipt.ipfsCID,
      blockNumber: Number(receipt.blockNumber),
      timestamp: Number(receipt.timestamp),
    };
  }

  /**
   * Check if receipt exists
   */
  async hasReceipt(jobId: string): Promise<boolean> {
    const jobIdBytes = this.stringToBytes32(jobId);

    return await this.publicClient.readContract({
      address: this.contractAddress,
      abi: INFERENCE_RECEIPT_ABI,
      functionName: 'hasReceipt',
      args: [jobIdBytes],
    });
  }

  /**
   * Watch for ReceiptEmitted events
   */
  async watchReceipts(
    onReceipt: (receipt: {
      jobId: string;
      modelHash: string;
      latencyMs: bigint;
      nodeSetRoot: string;
      verifier: Address;
      ipfsCID: string;
      blockNumber: bigint;
      transactionHash: Hash;
    }) => void
  ) {
    return this.publicClient.watchContractEvent({
      address: this.contractAddress,
      abi: INFERENCE_RECEIPT_ABI,
      eventName: 'ReceiptEmitted',
      onLogs: (logs) => {
        for (const log of logs) {
          onReceipt({
            jobId: this.bytes32ToString(log.args.jobId as Hash),
            modelHash: this.bytes32ToString(log.args.modelHash as Hash),
            latencyMs: log.args.latencyMs as bigint,
            nodeSetRoot: this.bytes32ToString(log.args.nodeSetRoot as Hash),
            verifier: log.args.verifier as Address,
            ipfsCID: log.args.ipfsCID as string,
            blockNumber: log.blockNumber || 0n,
            transactionHash: log.transactionHash,
          });
        }
      },
    });
  }

  // ============ Helper Functions ============

  private stringToBytes32(str: string): `0x${string}` {
    const hash = this.sha256(str);
    return hash as `0x${string}`;
  }

  private bytes32ToString(bytes: `0x${string}`): string {
    // In production, you'd maintain a mapping or decode properly
    // For MVP, we'll use the hex string
    return bytes;
  }

  private sha256(str: string): string {
    // Simple hash function for MVP (use crypto in production)
    // This is a placeholder - in production use proper keccak256
    return `0x${Buffer.from(str).toString('hex').padStart(64, '0').slice(0, 64)}`;
  }
}

/**
 * Create SDK instance
 */
export function createSDK(config: SDKConfig): EdgeNetSDK {
  return new EdgeNetSDK(config);
}

