import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, CalendarIcon, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLinkStore } from '@/store/link.store';
import { getApiErrorMessage } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Link } from '@/types';

interface EditLinkModalProps {
  link: Link;
}

const editLinkSchema = z.object({
  originalUrl: z.string().min(1, 'Destination URL is required').url('Please enter a valid URL'),
  isActive: z.boolean(),
  hasExpiration: z.boolean(),
  expiresAt: z.date().optional(),
}).refine((data) => {
  if (data.hasExpiration && !data.expiresAt) {
    return false;
  }
  return true;
}, {
  message: 'Expiration date and time is required when enabled',
  path: ['expiresAt'],
});

type EditLinkForm = z.infer<typeof editLinkSchema>;

export function EditLinkModal({ link }: EditLinkModalProps) {
  const [open, setOpen] = useState(false);
  const { updateLink } = useLinkStore();

  const form = useForm<EditLinkForm>({
    resolver: zodResolver(editLinkSchema),
    defaultValues: {
      originalUrl: link.originalUrl,
      isActive: link.isActive,
      hasExpiration: !!link.expiresAt,
      expiresAt: link.expiresAt ? new Date(link.expiresAt) : undefined,
    },
  });

  useEffect(() => {
    form.reset({
      originalUrl: link.originalUrl,
      isActive: link.isActive,
      hasExpiration: !!link.expiresAt,
      expiresAt: link.expiresAt ? new Date(link.expiresAt) : undefined,
    });
  }, [link, form]);

  const hasExpiration = form.watch('hasExpiration');

  const onSubmit = async (data: EditLinkForm) => {
    const expiresAtPayload = data.hasExpiration && data.expiresAt
      ? data.expiresAt.toISOString()
      : null;

    try {
      await updateLink(link.id, {
        originalUrl: data.originalUrl,
        isActive: data.isActive,
        expiresAt: expiresAtPayload,
      });

      toast.success('Link updated successfully!');
      setOpen(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update link'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Edit link"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit link</DialogTitle>
          <DialogDescription>
            Update the destination, status, and expiration details of your short link.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Destination URL */}
            <FormField
              control={form.control}
              name="originalUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/very/long/url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active Status */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-card">
                  <div className="space-y-0.5">
                    <FormLabel>Link Status</FormLabel>
                    <FormDescription>
                      Enable or disable redirection for this link.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                      <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Expiration Settings */}
            <div className="rounded-lg border p-3 shadow-sm space-y-3 bg-card">
              <FormField
                control={form.control}
                name="hasExpiration"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Expiration Status</FormLabel>
                      <FormDescription>
                        Set a date and time when this link should expire.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={field.value}
                          onChange={(e) => {
                            field.onChange(e);
                            if (!e.target.checked) {
                              form.setValue('expiresAt', undefined);
                            } else {
                              const tomorrow = new Date();
                              tomorrow.setDate(tomorrow.getDate() + 1);
                              tomorrow.setHours(12, 0, 0, 0);
                              form.setValue('expiresAt', tomorrow);
                            }
                          }}
                        />
                        <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem className={cn("flex flex-col space-y-2 transition-opacity duration-200", !hasExpiration && "opacity-50")}>
                    <FormLabel>Expiration Date & Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            disabled={!hasExpiration}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP p")
                            ) : (
                              <span>Pick a date and time</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (!date) return;
                            const newDate = field.value ? new Date(field.value) : new Date();
                            newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                            field.onChange(newDate);
                          }}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                        <div className="p-3 border-t border-border flex items-center justify-between gap-4">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Time</span>
                          </div>
                          <input
                            type="time"
                            disabled={!field.value}
                            value={field.value ? format(field.value, "HH:mm") : "12:00"}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(":").map(Number);
                              const newDate = field.value ? new Date(field.value) : new Date();
                              newDate.setHours(hours || 0, minutes || 0, 0, 0);
                              field.onChange(newDate);
                            }}
                            className="w-28 px-2 py-1 text-sm bg-transparent border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
