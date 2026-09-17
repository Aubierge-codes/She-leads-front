import Image from 'next/image';
import { motion } from 'framer-motion';
import { PlaceholderImage } from '@/components/placeholder-image';

interface StoryCardProps {
  name: string;
  affiliation: string;
  quote: string;
  image?: string;
  delay?: number;
}

export function StoryCard({ name, affiliation, quote, image, delay = 0 }: StoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay }}
      className="space-y-4"
    >
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
    </motion.div>
  );
}
