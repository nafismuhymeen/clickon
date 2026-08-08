import { useState } from 'react';
import {
  BarChart3,
  Power,
  PowerOff,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLinkStore } from '@/store/link.store';
import { EditLinkModal } from './EditLinkModal';
import type { Link } from '@/types';

interface LinkActionsProps {
  link: Link;
}

export function LinkActions({ link }: LinkActionsProps) {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { updateLink, deleteLink } = useLinkStore();

  const linkId = link.id;
  const isActive = link.isActive;
  const shortUrl = link.shortUrl;

  const handleToggle = () => {
    updateLink(linkId, { isActive: !isActive });
    toast.success(isActive ? 'Link deactivated' : 'Link activated');
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }

    deleteLink(linkId);
    toast.success('Link deleted');
    setConfirmDelete(false);
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => window.open(shortUrl, '_blank')}
        title="Open link"
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => navigate(`/analytics/${linkId}`)}
        title="View analytics"
      >
        <BarChart3 className="h-3.5 w-3.5" />
      </Button>

      <EditLinkModal link={link} />

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleToggle}
        title={isActive ? 'Deactivate link' : 'Activate link'}
      >
        {isActive ? (
          <Power className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <PowerOff className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${
          confirmDelete
            ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
            : 'hover:text-destructive'
        }`}
        onClick={handleDelete}
        title={confirmDelete ? 'Click again to confirm' : 'Delete link'}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
