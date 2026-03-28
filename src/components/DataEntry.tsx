import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Trash2, Save, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface DataEntry {
  id: string;
  productName: string;
  category: string;
  price: string;
  quantity: string;
  supplier: string;
  date: string;
}

const emptyEntry = (): DataEntry => ({
  id: crypto.randomUUID(),
  productName: '',
  category: '',
  price: '',
  quantity: '',
  supplier: '',
  date: new Date().toISOString().split('T')[0],
});

export default function DataEntryTab() {
  const [entries, setEntries] = useState<DataEntry[]>([emptyEntry()]);

  const addRow = () => setEntries(prev => [...prev, emptyEntry()]);

  const updateEntry = (id: string, field: keyof DataEntry, value: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeRow = (id: string) => {
    if (entries.length === 1) return toast.error('Need at least one row');
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const saveData = () => {
    const valid = entries.every(e => e.productName.trim());
    if (!valid) return toast.error('Product name is required for all rows');
    localStorage.setItem('dataEntries', JSON.stringify(entries));
    toast.success('Data saved successfully!');
  };

  const downloadCSV = () => {
    if (entries.length === 0) return toast.error('No data to export');
    const headers = ['Product Name', 'Category', 'Price', 'Quantity', 'Supplier', 'Date'];
    const rows = entries.map(e => [e.productName, e.category, e.price, e.quantity, e.supplier, e.date]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded!');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Data Entry</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addRow}>
            <Plus className="w-4 h-4 mr-1" /> Add Row
          </Button>
          <Button variant="outline" size="sm" onClick={saveData}>
            <Save className="w-4 h-4 mr-1" /> Save
          </Button>
          <Button size="sm" onClick={downloadCSV} className="gradient-primary border-0">
            <Download className="w-4 h-4 mr-1" /> CSV
          </Button>
        </div>
      </div>

      <Card className="glass overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Product Name</TableHead>
                  <TableHead className="text-muted-foreground">Category</TableHead>
                  <TableHead className="text-muted-foreground">Price</TableHead>
                  <TableHead className="text-muted-foreground">Quantity</TableHead>
                  <TableHead className="text-muted-foreground">Supplier</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id} className="border-border">
                    {(['productName', 'category', 'price', 'quantity', 'supplier', 'date'] as const).map(field => (
                      <TableCell key={field} className="p-1">
                        <Input
                          value={entry[field]}
                          onChange={(e) => updateEntry(entry.id, field, e.target.value)}
                          type={field === 'date' ? 'date' : field === 'price' || field === 'quantity' ? 'number' : 'text'}
                          className="bg-transparent border-border/50 h-8 text-sm"
                          placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
                        />
                      </TableCell>
                    ))}
                    <TableCell className="p-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeRow(entry.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <FileSpreadsheet className="w-3 h-3" /> {entries.length} row(s) • Click "CSV" to download
      </p>
    </div>
  );
}
