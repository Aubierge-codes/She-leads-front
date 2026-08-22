'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectNative } from '@/components/ui/select-native';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Search, Plus, Package, AlertTriangle, PackageOpen, Loader2 } from 'lucide-react';
import { Modal } from '@/components/modal';
import { inventoryApi, apiErrorMessage, InventoryItem, InventoryTransactionType } from '@/lib/api';
import { toast } from 'sonner';

const emptyItemForm = { name: '', unit: 'units', quantity: '0', minimumStock: '0' };
const emptyTxnForm = { type: 'RESTOCK' as InventoryTransactionType, quantity: '', note: '' };

function stockStatus(item: InventoryItem) {
  if (item.quantity <= 0) return { label: 'Out of Stock', style: 'bg-red-500/10 text-red-600 dark:text-red-400' };
  if (item.quantity <= item.minimumStock) return { label: 'Low Stock', style: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' };
  return { label: 'In Stock', style: 'bg-primary/10 text-primary' };
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [isSavingItem, setIsSavingItem] = useState(false);

  const [txnItem, setTxnItem] = useState<InventoryItem | null>(null);
  const [txnForm, setTxnForm] = useState(emptyTxnForm);
  const [isSavingTxn, setIsSavingTxn] = useState(false);

  const load = () => {
    setIsLoading(true);
    inventoryApi
      .list()
      .then(setItems)
      .catch(() => toast.error('Failed to load inventory'))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const filtered = items.filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const lowStockCount = items.filter((i) => i.quantity <= i.minimumStock).length;

  const openCreate = () => {
    setItemForm(emptyItemForm);
    setCreateOpen(true);
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingItem(true);
    try {
      await inventoryApi.create({
        name: itemForm.name,
        unit: itemForm.unit,
        quantity: Number(itemForm.quantity),
        minimumStock: Number(itemForm.minimumStock),
      });
      toast.success('Item added');
      setCreateOpen(false);
      load();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setIsSavingItem(false);
    }
  };

  const openTxn = (item: InventoryItem) => {
    setTxnItem(item);
    setTxnForm(emptyTxnForm);
  };

  const handleTxn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnItem) return;
    setIsSavingTxn(true);
    try {
      await inventoryApi.recordTransaction(txnItem.id, {
        type: txnForm.type,
        quantity: Number(txnForm.quantity),
        note: txnForm.note || undefined,
      });
      toast.success('Stock updated');
      setTxnItem(null);
      load();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setIsSavingTxn(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Package className="w-8 h-8 text-primary" />
            Inventory Management
          </h1>
          <p className="text-muted-foreground">Track equipment, supplies, and receive automatic low-stock alerts.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="w-full sm:w-auto" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="border-none shadow-sm bg-card border-l-4 border-l-red-500">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Alerts</p>
              <h3 className="text-2xl font-bold text-foreground">{lowStockCount} Items Low/Out</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Items Tracked</p>
              <h3 className="text-2xl font-bold text-foreground">{items.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <PackageOpen className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-card">
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by item name..."
              className="pl-9 w-full md:max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-md">Item Name</th>
                    <th className="px-4 py-3">Stock Level</th>
                    <th className="px-4 py-3">Min. Threshold</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-tr-md text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const status = stockStatus(item);
                    return (
                      <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4 font-medium text-foreground">{item.name}</td>
                        <td className="px-4 py-4 font-semibold text-foreground">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">{item.minimumStock}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.style}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button variant="ghost" size="sm" className="h-8 text-primary hover:text-primary/80" onClick={() => openTxn(item)}>
                            Update Stock
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-muted-foreground">
                        No items found in inventory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add Inventory Item">
        <form onSubmit={handleCreateItem} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input id="name" required value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input id="unit" value={itemForm.unit} onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={0}
                value={itemForm.quantity}
                onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimumStock">Min. Stock</Label>
              <Input
                id="minimumStock"
                type="number"
                min={0}
                value={itemForm.minimumStock}
                onChange={(e) => setItemForm({ ...itemForm, minimumStock: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSavingItem}>
              {isSavingItem ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Item'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!txnItem} onClose={() => setTxnItem(null)} title={`Update Stock: ${txnItem?.name ?? ''}`}>
        <form onSubmit={handleTxn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="txnType">Transaction Type</Label>
            <SelectNative
              id="txnType"
              value={txnForm.type}
              onChange={(e) => setTxnForm({ ...txnForm, type: e.target.value as InventoryTransactionType })}
            >
              <option value="RESTOCK">Restock (add)</option>
              <option value="USAGE">Usage (subtract)</option>
              <option value="ADJUSTMENT">Adjustment (set exact quantity)</option>
            </SelectNative>
          </div>
          <div className="space-y-2">
            <Label htmlFor="txnQuantity">
              {txnForm.type === 'ADJUSTMENT' ? 'New Quantity' : 'Quantity'}
            </Label>
            <Input
              id="txnQuantity"
              type="number"
              min={0}
              required
              value={txnForm.quantity}
              onChange={(e) => setTxnForm({ ...txnForm, quantity: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="txnNote">Note</Label>
            <Input id="txnNote" value={txnForm.note} onChange={(e) => setTxnForm({ ...txnForm, note: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setTxnItem(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSavingTxn}>
              {isSavingTxn ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
