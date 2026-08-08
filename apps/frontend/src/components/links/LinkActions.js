import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { BarChart3, Power, PowerOff, Trash2, ExternalLink, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLinkStore } from '@/store/link.store';
import { EditLinkModal } from './EditLinkModal';
export function LinkActions({ link }) {
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
    return (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", onClick: () => window.open(shortUrl, '_blank'), title: "Open link", children: _jsx(ExternalLink, { className: "h-3.5 w-3.5" }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", onClick: () => navigate(`/analytics/${linkId}`), title: "View analytics", children: _jsx(BarChart3, { className: "h-3.5 w-3.5" }) }), _jsx(EditLinkModal, { link: link }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", onClick: handleToggle, title: isActive ? 'Deactivate link' : 'Activate link', children: isActive ? (_jsx(Power, { className: "h-3.5 w-3.5 text-green-500" })) : (_jsx(PowerOff, { className: "h-3.5 w-3.5 text-muted-foreground" })) }), _jsx(Button, { variant: "ghost", size: "icon", className: `h-8 w-8 ${confirmDelete
                    ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                    : 'hover:text-destructive'}`, onClick: handleDelete, title: confirmDelete ? 'Click again to confirm' : 'Delete link', children: _jsx(Trash2, { className: "h-3.5 w-3.5" }) })] }));
}
