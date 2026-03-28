import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, BarChart3, Database, FileText, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatBot from '@/components/ChatBot';
import Dashboard from '@/components/Dashboard';
import DataEntry from '@/components/DataEntry';
import InvoiceGenerator from '@/components/InvoiceGenerator';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="font-bold text-foreground tracking-tight">MarketPulse</h1>
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block">AI-Powered Market Intelligence</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="chatbot" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card border border-border">
            <TabsTrigger value="chatbot" className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Advisor</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Data Entry</span>
            </TabsTrigger>
            <TabsTrigger value="invoice" className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Invoices</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="chatbot">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <ChatBot />
              </motion.div>
            </TabsContent>
            <TabsContent value="dashboard">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Dashboard />
              </motion.div>
            </TabsContent>
            <TabsContent value="data">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <DataEntry />
              </motion.div>
            </TabsContent>
            <TabsContent value="invoice">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <InvoiceGenerator />
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
