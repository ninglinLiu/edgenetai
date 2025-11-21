/**
 * @file demo.ts
 * @description 3-minute demo script for EdgeNet.AI PoI MVP
 */

import { createSDK } from '@edgenetai/sdk';

const ROUTER_API_URL = 'http://localhost:3001';
const DASHBOARD_URL = 'http://localhost:3000';

async function demo() {
  console.log('🚀 EdgeNet.AI PoI MVP Demo\n');

  // Step 1: Submit a task
  console.log('1️⃣  Submitting LLM summary task...');
  const taskResponse = await fetch(`${ROUTER_API_URL}/trpc/task.create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'LLM_SUMMARY',
      payload:
        'Artificial intelligence is transforming industries across the globe. From healthcare to finance, AI technologies are enabling new capabilities and improving efficiency. Machine learning algorithms can now process vast amounts of data to identify patterns and make predictions with remarkable accuracy.',
      modelId: 'llama3:8b',
      slaTier: 'SILVER',
    }),
  });

  const taskData = await taskResponse.json();
  const taskId = taskData.result?.data?.taskId;

  if (!taskId) {
    console.error('❌ Failed to create task');
    return;
  }

  console.log(`✅ Task created: ${taskId}`);
  console.log(`   View at: ${DASHBOARD_URL}/tasks/${taskId}\n`);

  // Step 2: Poll for status
  console.log('2️⃣  Waiting for execution and verification...');
  let status: any = null;
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const statusResponse = await fetch(
      `${ROUTER_API_URL}/trpc/task.status?input=${encodeURIComponent(JSON.stringify({ id: taskId }))}`
    );
    status = (await statusResponse.json()).result?.data;

    if (status?.task?.status === 'COMPLETED' || status?.receipt) {
      break;
    }

    attempts++;
    process.stdout.write('.');
  }

  console.log('\n');

  if (status?.receipt) {
    console.log('✅ Task completed and receipt emitted!');
    console.log(`   TX Hash: ${status.receipt.txHash}`);
    console.log(`   Block: ${status.receipt.blockNumber}`);
  } else if (status?.verification) {
    console.log(`✅ Verification: ${status.verification.result}`);
    if (status.verification.details) {
      console.log(`   Similarity: ${status.verification.details.similarity?.toFixed(3)}`);
    }
  }

  console.log('\n3️⃣  Demo complete!');
  console.log(`   Dashboard: ${DASHBOARD_URL}`);
  console.log(`   Task: ${DASHBOARD_URL}/tasks/${taskId}`);
}

demo().catch(console.error);

