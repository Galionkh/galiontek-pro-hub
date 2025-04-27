
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Download, FileText, PieChart, BarChart3, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionForm } from "@/components/finances/TransactionForm";
import { TransactionsList } from "@/components/finances/TransactionsList";
import { TransactionsSummary } from "@/components/finances/TransactionsSummary";
import { FinancialCharts } from "@/components/finances/FinancialCharts";
import { Badge } from "@/components/ui/badge";

export default function Finances() {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "charts">("list");
  const { transactions, isLoading, addTransaction } = useTransactions();
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  
  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">כספים</h1>
          <p className="text-muted-foreground">ניהול הכנסות והוצאות</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>יצוא דוח PDF</span>
          </Button>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>רישום חדש</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-right">רישום כספי חדש</DialogTitle>
              </DialogHeader>
              <TransactionForm 
                onSubmit={async (data) => {
                  await addTransaction.mutateAsync(data);
                  return data;
                }}
                onClose={() => setOpen(false)}
                isSubmitting={addTransaction.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">מאזן כולל</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {balance.toLocaleString('he-IL', {
                style: 'currency',
                currency: 'ILS'
              })}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <span>הכנסות</span>
              <Badge variant="outline" className="mr-2 bg-green-50 text-green-700 border-green-200">+</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {totalIncome.toLocaleString('he-IL', {
                style: 'currency',
                currency: 'ILS'
              })}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <span>הוצאות</span>
              <Badge variant="outline" className="mr-2 bg-red-50 text-red-700 border-red-200">-</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {totalExpenses.toLocaleString('he-IL', {
                style: 'currency',
                currency: 'ILS'
              })}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          variant={viewMode === "list" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setViewMode("list")}
          className="flex items-center gap-1"
        >
          <FileText className="h-4 w-4" />
          <span>רשימה</span>
        </Button>
        <Button 
          variant={viewMode === "charts" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setViewMode("charts")}
          className="flex items-center gap-1"
        >
          <PieChart className="h-4 w-4" />
          <span>גרפים</span>
        </Button>
      </div>
      
      {viewMode === "list" ? (
        <Tabs defaultValue="all">
          <TabsList className="grid w-full md:w-auto grid-cols-4 md:grid-cols-4">
            <TabsTrigger value="all">הכל</TabsTrigger>
            <TabsTrigger value="income">הכנסות</TabsTrigger>
            <TabsTrigger value="expenses">הוצאות</TabsTrigger>
            <TabsTrigger value="invoices">חשבוניות</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <TransactionsList 
              transactions={transactions}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="income" className="mt-4">
            <TransactionsList 
              transactions={transactions.filter(t => t.type === 'income')}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="expenses" className="mt-4">
            <TransactionsList 
              transactions={transactions.filter(t => t.type === 'expense')}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="invoices" className="mt-4">
            <Card className="p-6">
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                <h2 className="text-xl font-semibold mb-2">חשבוניות</h2>
                <p>כאן יוצגו החשבוניות שהנפקת</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="p-6">
          <div className="space-y-6">
            <FinancialCharts transactions={transactions} />
          </div>
        </Card>
      )}

      <TransactionsSummary transactions={transactions} />
    </div>
  );
}
