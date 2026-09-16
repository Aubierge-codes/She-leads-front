import Image from 'next/image';
import { PlaceholderImage } from '@/components/placeholder-image';

interface StoryCardProps {
  name: string;
  affiliation: string;
  quote: string;
  image?: string;
}

export function StoryCard({ name, affiliation, quote, image }: StoryCardProps) {
  return (
    <div className="space-y-4">
      {image ? (
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
      ) : (
        <PlaceholderImage label="Add photo: participant portrait" aspect="square" variant="users" />
      )}
      <p className="font-heading text-lg leading-snug text-foreground">&ldquo;{quote}&rdquo;</p>
      <div className="text-sm">
        <p className="font-medium text-foreground">{name}</p>
        <p className="text-muted-foreground">{affiliation}</p>
      </div>
    </div>
  );
}
