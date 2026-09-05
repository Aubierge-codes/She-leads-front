'use client';

import { useEffect, useState } from 'react';
import { GraduationCap, Loader2, MapPin } from 'lucide-react';
import { communitiesApi, schoolsApi, type Community, type School } from '@/lib/api';

export function ReachSection() {
  const [schools, setSchools] = useState<School[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([schoolsApi.list(), communitiesApi.list()])
      .then(([s, c]) => {
        setSchools(s);
        setCommunities(c);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {communities.map((c) => (
          <span
            key={c.id}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"
          >
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {c.name}
            <span className="text-xs text-muted-foreground">{c.state}</span>
          </span>
        ))}
        {schools.map((s) => (
          <span
            key={s.id}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-2 text-sm font-medium text-foreground"
          >
            <GraduationCap className="h-3.5 w-3.5 text-secondary" />
            {s.name}
          </span>
        ))}
        {communities.length === 0 && schools.length === 0 && (
          <p className="text-sm text-muted-foreground">No communities or schools added yet.</p>
        )}
      </div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        Illustrative overview — not a geographic map.
      </p>
    </div>
  );
}
