import { useState } from 'react';
import { Link2, Plus, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LinkList } from '@/components/links/LinkList';
import { CreateLinkModal } from '@/components/links/CreateLinkModal';
import { useLinkStore } from '@/store/link.store';
import { formatNumber } from '@/lib/utils';

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const links = useLinkStore((s) => s.links);

  const totalClicks = links.reduce((sum, l) => sum + (l.totalClicks ?? 0), 0);

  const pagination = {
    page,
    totalPages: 1,
    total: links.length,
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Links</h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and track your shortened URLs
          </p>
        </div>
        <CreateLinkModal />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Link2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatNumber(links.length)}</p>
              <p className="text-xs text-muted-foreground">Total Links</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <MousePointerClick className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatNumber(totalClicks)}</p>
              <p className="text-xs text-muted-foreground">Total Clicks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Link list */}
      <LinkList
        links={links}
        isLoading={false}
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Empty state */}
      {links.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Link2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No links yet</h3>
              <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                Create your first shortened link and start tracking clicks in real time.
              </p>
            </div>
            <CreateLinkModal
              trigger={
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Create your first link
                </Button>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
