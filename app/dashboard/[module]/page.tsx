import { Card, CardContent } from '@/components/ui/card';
import { Hammer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const resolvedParams = await params;
  const title = resolvedParams.module.charAt(0).toUpperCase() + resolvedParams.module.slice(1);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
      <Card className="max-w-md w-full border-none shadow-md bg-card text-center p-8">
        <CardContent className="flex flex-col items-center p-0">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
            <Hammer className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">{title} Module</h1>
          <p className="text-muted-foreground mb-8">
            This module is currently under development. It will feature comprehensive management and reporting tools for {title.toLowerCase()}.
          </p>
          <Link href="/dashboard" className="text-primary font-medium hover:underline flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
