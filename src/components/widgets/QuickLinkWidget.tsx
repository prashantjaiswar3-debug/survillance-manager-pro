"use client";

import { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { Widget, LinkItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ExternalLink, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function QuickLinkWidget({ widget }: { widget: Widget }) {
  const { updateWidget } = useDashboard();
  const { toast } = useToast();
  const links: LinkItem[] = widget.content;
  const [addLinkOpen, setAddLinkOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const updateLinks = (newLinks: LinkItem[]) => {
    updateWidget(widget.id, { content: newLinks });
  };
  
  const handleAddLink = () => {
    if (newLabel.trim() && newUrl.trim()) {
        try {
            let formattedUrl = newUrl;
            if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
                formattedUrl = `https://${formattedUrl}`;
            }
            new URL(formattedUrl);
            const newLink: LinkItem = { id: crypto.randomUUID(), label: newLabel, url: formattedUrl };
            updateLinks([...links, newLink]);
            setNewLabel('');
            setNewUrl('');
            setAddLinkOpen(false);
        } catch (_) {
            toast({
                variant: 'destructive',
                title: 'Invalid URL',
                description: 'Please enter a valid URL (e.g., https://example.com)',
            })
        }
    }
  };
  
  const handleRemoveLink = (linkId: string) => {
    updateLinks(links.filter(link => link.id !== linkId));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-2 overflow-y-auto pr-2">
        {links.map(link => (
          <div key={link.id} className="flex items-center justify-between group">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-foreground hover:text-primary hover:underline flex-1 truncate"
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              <span className="truncate">{link.label}</span>
            </a>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0" onClick={() => handleRemoveLink(link.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
         {links.length === 0 && (
            <p className="text-sm text-muted-foreground text-center pt-4">No links added yet.</p>
        )}
      </div>
      <Dialog open={addLinkOpen} onOpenChange={setAddLinkOpen}>
        <DialogTrigger asChild>
            <Button variant="outline" className="mt-4 w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Link
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add a new link</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <Input placeholder="Label (e.g., Google)" value={newLabel} onChange={e => setNewLabel(e.target.value)} />
                <Input placeholder="URL (e.g., google.com)" value={newUrl} onChange={e => setNewUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddLink()} />
            </div>
            <Button onClick={handleAddLink}>Add</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
