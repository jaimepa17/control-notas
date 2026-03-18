import { useEffect } from 'react';
import { AppState } from 'react-native';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type UseRealtimeTableParams<T extends { id: string }> = {
  enabled: boolean;
  table: string;
  schema?: string;
  filter?: string;
  channelName: string;
  onInsert?: (row: T) => void;
  onUpdate?: (row: T) => void;
  onDelete?: (row: { id: string }) => void;
  onForegroundSync?: () => void | Promise<void>;
};

export function useRealtimeTable<T extends { id: string }>({
  enabled,
  table,
  schema = 'public',
  filter,
  channelName,
  onInsert,
  onUpdate,
  onDelete,
  onForegroundSync,
}: UseRealtimeTableParams<T>) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema,
          table,
          filter,
        },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          if (payload.eventType === 'INSERT' && onInsert) {
            onInsert(payload.new as T);
            return;
          }

          if (payload.eventType === 'UPDATE' && onUpdate) {
            onUpdate(payload.new as T);
            return;
          }

          if (payload.eventType === 'DELETE' && onDelete) {
            onDelete(payload.old as { id: string });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED' && onForegroundSync) {
          void onForegroundSync();
        }
      });

    const appStateSub = onForegroundSync
      ? AppState.addEventListener('change', (state) => {
          if (state === 'active') {
            void onForegroundSync();
          }
        })
      : null;

    return () => {
      appStateSub?.remove();
      void supabase.removeChannel(channel);
    };
  }, [
    enabled,
    channelName,
    schema,
    table,
    filter,
    onInsert,
    onUpdate,
    onDelete,
    onForegroundSync,
  ]);
}
