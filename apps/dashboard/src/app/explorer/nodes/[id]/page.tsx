import { NodeDetailClient } from './NodeDetailClient';
import { getNodes } from '@/lib/mock/fixtures';

export function generateStaticParams() {
  const nodes = getNodes('busy');
  return nodes.slice(0, 10).map((node) => ({
    id: node.id,
  }));
}

export default function NodeDetailPage({ params }: { params: { id: string } }) {
  return <NodeDetailClient nodeId={params.id} />;
}
