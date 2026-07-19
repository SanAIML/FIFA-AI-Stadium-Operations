import { FlaskConical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/hooks/useData';

export function DemoModeBadge() {
  const { isDemoMode } = useData();

  if (!isDemoMode) return null;

  return (
    <Badge
      variant="outline"
      className="border-warning/40 bg-warning/10 text-[10px] font-medium text-warning"
      aria-label="Demo Mode active"
    >
      <FlaskConical className="mr-1 h-3 w-3" aria-hidden="true" />
      Demo Mode
    </Badge>
  );
}
