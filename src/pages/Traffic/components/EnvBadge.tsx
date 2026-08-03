import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function EnvBadge({
  environment,
  className,
}: {
  environment?: string | null;
  className?: string;
}) {
  const label = environment || '—';
  const isLocal = environment === 'localhost';
  return (
    <Badge
      variant={isLocal ? 'secondary' : 'outline'}
      className={cn(
        'font-normal capitalize',
        isLocal && 'border-[color-mix(in_srgb,var(--warning)_35%,transparent)] text-[var(--warning)]',
        !isLocal &&
          environment === 'production' &&
          'border-[color-mix(in_srgb,var(--success)_35%,transparent)] text-[var(--success)]',
        className
      )}
    >
      {label}
    </Badge>
  );
}
