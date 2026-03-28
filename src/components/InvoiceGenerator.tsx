import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Plus, Trash2, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function InvoiceGenerator() {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString(36).toUpperCase()}`);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0 },
  ]);

  // Load products from data entry if available
  useEffect(() => {
    const saved = localStorage.getItem('dataEntries');
    if (saved) {
      try {
        const entries = JSON.parse(saved);
        if (entries.length > 0 && entries[0].productName) {
          const imported = entries
            .filter((e: any) => e.productName)
            .map((e: any) => ({
              id: crypto.randomUUID(),
              description: e.productName,
              quantity: parseInt(e.quantity) || 1,
              unitPrice: parseFloat(e.price) || 0,
            }));
          if (imported.length > 0) setItems(imported);
        }
      } catch {}
    }
  }, []);

  const addItem = () => setItems(prev => [...prev, { id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0 }]);

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const downloadInvoice = () => {
    if (!customerName.trim()) return toast.error('Customer name is required');
    if (items.some(i => !i.description.trim())) return toast.error('All items need a description');

    const invoiceHtml = `
<!DOCTYPE html>
<html><head><style>
  body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#1a1a2e}
  .header{display:flex;justify-content:space-between;margin-bottom:40px}
  .title{font-size:28px;font-weight:bold;color:#2d6a4f}
  table{width:100%;border-collapse:collapse;margin:20px 0}
  th{background:#2d6a4f;color:white;padding:10px;text-align:left}
  td{padding:10px;border-bottom:1px solid #ddd}
  .total-row{font-weight:bold;font-size:18px;color:#2d6a4f}
  .footer{margin-top:40px;text-align:center;color:#666;font-size:12px}
</style></head><body>
  <div class="header">
    <div><div class="title">INVOICE</div><p>${invoiceNumber}</p><p>Date: ${new Date().toLocaleDateString()}</p></div>
    <div><p><strong>Bill To:</strong></p><p>${customerName}</p><p>${customerEmail}</p></div>
  </div>
  <table><thead><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead><tbody>
    ${items.map(i => `<tr><td>${i.description}</td><td>${i.quantity}</td><td>$${i.unitPrice.toFixed(2)}</td><td>$${(i.quantity * i.unitPrice).toFixed(2)}</td></tr>`).join('')}
  </tbody></table>
  <div style="text-align:right;margin-top:20px">
    <p>Subtotal: $${subtotal.toFixed(2)}</p>
    <p>Tax (10%): $${tax.toFixed(2)}</p>
    <p class="total-row">Total: $${total.toFixed(2)}</p>
  </div>
  <div class="footer"><p>Thank you for your business!</p></div>
</body></html>`;

    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoiceNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Invoice downloaded!');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Invoice Generator</h2>
        <Button onClick={downloadInvoice} className="gradient-primary border-0">
          <Download className="w-4 h-4 mr-1" /> Download Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass">
          <CardContent className="pt-4 space-y-2">
            <label className="text-xs text-muted-foreground">Invoice #</label>
            <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="bg-transparent border-border/50" />
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4 space-y-2">
            <label className="text-xs text-muted-foreground">Customer Name</label>
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="John Doe" className="bg-transparent border-border/50" />
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4 space-y-2">
            <label className="text-xs text-muted-foreground">Customer Email</label>
            <Input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="john@example.com" type="email" className="bg-transparent border-border/50" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Description</TableHead>
                <TableHead className="text-muted-foreground w-24">Qty</TableHead>
                <TableHead className="text-muted-foreground w-32">Unit Price</TableHead>
                <TableHead className="text-muted-foreground w-32">Total</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="border-border">
                  <TableCell className="p-1">
                    <Input value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="bg-transparent border-border/50 h-8 text-sm" placeholder="Product name" />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} className="bg-transparent border-border/50 h-8 text-sm" />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input type="number" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} className="bg-transparent border-border/50 h-8 text-sm" />
                  </TableCell>
                  <TableCell className="p-1 text-sm font-medium text-foreground">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </TableCell>
                  <TableCell className="p-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(item.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={addItem}>
          <Plus className="w-4 h-4 mr-1" /> Add Item
        </Button>
        <Card className="glass w-64">
          <CardContent className="py-3 space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
            <Separator className="my-1" />
            <div className="flex justify-between font-bold text-foreground text-base"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
