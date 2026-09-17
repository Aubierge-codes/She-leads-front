import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { PlaceholderImage } from '@/components/placeholder-image';

interface ProgramCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  photoLabel: string;
  delay?: number;
}

export function ProgramCard({ icon: Icon, title, description, photoLabel, delay = 0 }: ProgramCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay }}
      className="group space-y-4"
    >
      <PlaceholderImage label={photoLabel} aspect="video" variant="sprout" />
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
