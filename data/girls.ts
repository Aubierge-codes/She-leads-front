// Placeholder participant/story data for the "Girls in Action" showcase.
//
// Eco Girls Collective has ~80 real participants across three engagement areas.
// This file holds a small representative set per category (not 80 fabricated
// identities) so the showcase component can be built and reviewed now. Add real
// entries here as photos/stories become available — the component reads this
// array directly and needs no changes to scale up. This can later be swapped
// for a fetch from an API/database using the same GirlStory shape.

export type GirlCategory = 'school' | 'community' | 'environment';

export interface GirlStory {
  id: number;
  /** Real name, once available and consented to be shared publicly. */
  name?: string;
  category: GirlCategory;
  /** Caption for the PlaceholderImage until a real photo is added. */
  photoLabel: string;
  title: string;
  description: string;
}

export const girlsData: GirlStory[] = [
  {
    id: 1,
    category: 'school',
    photoLabel: 'Add photo: environmental club meeting',
    title: 'Leading the school environmental club',
    description: '[Add a real story about this activity]',
  },
  {
    id: 2,
    category: 'school',
    photoLabel: 'Add photo: classroom climate lesson',
    title: 'Classroom climate education',
    description: '[Add a real story about this activity]',
  },
  {
    id: 3,
    category: 'school',
    photoLabel: 'Add photo: leadership workshop',
    title: 'Leadership skills workshop',
    description: '[Add a real story about this activity]',
  },
  {
    id: 4,
    category: 'community',
    photoLabel: 'Add photo: community outreach day',
    title: 'Community awareness outreach',
    description: '[Add a real story about this activity]',
  },
  {
    id: 5,
    category: 'community',
    photoLabel: 'Add photo: working with local leaders',
    title: 'Partnering with community members',
    description: '[Add a real story about this activity]',
  },
  {
    id: 6,
    category: 'community',
    photoLabel: 'Add photo: local initiative launch',
    title: 'Launching a local initiative',
    description: '[Add a real story about this activity]',
  },
  {
    id: 7,
    category: 'environment',
    photoLabel: 'Add photo: tree planting day',
    title: 'Tree planting day',
    description: '[Add a real story about this activity]',
  },
  {
    id: 8,
    category: 'environment',
    photoLabel: 'Add photo: community cleanup',
    title: 'Community cleanup event',
    description: '[Add a real story about this activity]',
  },
  {
    id: 9,
    category: 'environment',
    photoLabel: 'Add photo: recycling and sorting',
    title: 'Recycling and waste sorting',
    description: '[Add a real story about this activity]',
  },
];

export const CATEGORY_LABELS: Record<GirlCategory, string> = {
  school: 'School',
  community: 'Community',
  environment: 'Environment',
};
