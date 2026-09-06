import { cn } from '@/lib/utils';

interface StatTileProps {
  value: string;
  label: string;
  className?: string;
}

export function StatTile({ value, label, className }: StatTileProps) {
  return (
    <div className={cn('flex flex-col gap-1 border-l-2 border-primary/30 pl-4', className)}>
      <span className="font-heading text-3xl font-bold text-foreground md:text-4xl">{value}</span>
      <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
    </div>
  );
}
