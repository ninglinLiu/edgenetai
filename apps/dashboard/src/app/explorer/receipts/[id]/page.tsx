import { ReceiptDetailClient } from './ReceiptDetailClient';
import { getReceipts } from '@/lib/mock/fixtures';

export function generateStaticParams() {
  const receipts = getReceipts('busy');
  return receipts.slice(0, 10).map((receipt) => ({
    id: receipt.receiptId,
  }));
}

export default function ReceiptDetailPage({ params }: { params: { id: string } }) {
  return <ReceiptDetailClient receiptId={params.id} />;
}
