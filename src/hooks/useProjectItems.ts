import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type TableName =
  | 'material_items'
  | 'subcontractor_items'
  | 'direct_manpower_items'
  | 'direct_equipment_items'
  | 'service_items'
  | 'indirect_manpower_items'
  | 'indirect_cost_items'
  | 'boq_items';

export function useProjectItems<T extends { id: string }>(
  tableName: TableName,
  projectId: string | undefined,
  userId: string | undefined
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) {
      toast({ title: 'خطأ في تحميل البيانات', description: error.message, variant: 'destructive' });
    } else {
      setItems((data as unknown as T[]) || []);
    }
    setLoading(false);
  }, [projectId, tableName]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (item: Omit<T, 'id' | 'created_at' | 'updated_at'>) => {
    if (!projectId || !userId) return;
    const payload = { ...item, project_id: projectId, user_id: userId } as any;
    const { data, error } = await supabase.from(tableName).insert(payload).select().single();
    if (error) {
      toast({ title: 'خطأ في الإضافة', description: error.message, variant: 'destructive' });
      return null;
    }
    const newItem = data as unknown as T;
    setItems(prev => [...prev, newItem]);
    return newItem;
  };

  const addItems = async (newItems: Omit<T, 'id' | 'created_at' | 'updated_at'>[]) => {
    if (!projectId || !userId || newItems.length === 0) return;
    const payload = newItems.map(item => ({ ...item, project_id: projectId, user_id: userId })) as any;
    const { data, error } = await supabase.from(tableName).insert(payload).select();
    if (error) {
      toast({ title: 'خطأ في استيراد البيانات', description: error.message, variant: 'destructive' });
      return null;
    }
    const insertedItems = data as unknown as T[];
    setItems(prev => [...prev, ...insertedItems]);
    return insertedItems;
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    const { error } = await supabase.from(tableName).update(updates as any).eq('id', id);
    if (error) {
      toast({ title: 'خطأ في التحديث', description: error.message, variant: 'destructive' });
      return false;
    }
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    return true;
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) {
      toast({ title: 'خطأ في الحذف', description: error.message, variant: 'destructive' });
      return false;
    }
    setItems(prev => prev.filter(item => item.id !== id));
    return true;
  };

  const totalAmount = items.reduce((sum, item: any) => sum + (Number(item.amount) || 0), 0);

  return { items, loading, addItem, addItems, updateItem, deleteItem, fetchItems, totalAmount };
}
