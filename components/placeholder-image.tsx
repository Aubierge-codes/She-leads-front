import { Camera, Leaf, Sprout, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const ASPECT_CLASSES = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  wide: 'aspect-[21/9]',
} as const;

const VARIANT_ICONS = {
  leaf: Leaf,
  sprout: Sprout,
  users: Users,
  camera: Camera,
} as const;

interface PlaceholderImageProps {
  label: string;
  aspect?: keyof typeof ASPECT_CLASSES;
  variant?: keyof typeof VARIANT_ICONS;
  className?: string;
}

export function PlaceholderImage({ label, aspect = 'video', variant = 'camera', className }: PlaceholderImageProps) {
  const Icon = VARIANT_ICONS[variant];

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border-2 border-dashed border-primary/25 bg-muted/60 p-6 text-center',
        ASPECT_CLASSES[aspect],
        className,
      )}
    >
      <span className="absolute top-3 right-3 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-foreground">
        Placeholder
      </span>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <p className="max-w-[220px] text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
