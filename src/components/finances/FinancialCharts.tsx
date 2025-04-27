import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { Transaction } from "@/hooks/useTransactions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FinancialChartsProps {
  transactions: Transaction[];
}

export function FinancialCharts({ transactions }: FinancialChartsProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground" dir="rtl">
        <h2 className="text-xl font-semibold mb-2">אין נתונים להציג</h2>
        <p>הוסף רישומים כספיים כדי לראות את הגרפים</p>
      </div>
    );
  }
  
  const monthlyData = transactions.reduce((acc: Record<string, {income: number, expense: number}>, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { income: 0, expense: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[monthYear].income += transaction.amount;
    } else {
      acc[monthYear].expense += transaction.amount;
    }
    
    return acc;
  }, {});
  
  const monthlyStats = Object.entries(monthlyData)
    .map(([monthYear, stats]) => {
      const [year, month] = monthYear.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      
      return {
        monthYear,
        month: new Intl.DateTimeFormat('he-IL', { month: 'short' }).format(date),
        income: stats.income,
        expenses: stats.expense,
        balance: stats.income - stats.expense
      };
    })
    .sort((a, b) => a.monthYear.localeCompare(b.monthYear))
    .slice(-6);
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const pieData = [
    { name: "הכנסות", value: totalIncome, color: "#3b82f6" },
    { name: "הוצאות", value: totalExpenses, color: "#ef4444" }
  ];
  
  const COLORS = ['#3b82f6', '#ef4444'];
  
  return (
    <Tabs defaultValue="monthly" dir="rtl">
      <TabsList className="w-full justify-start mb-6">
        <TabsTrigger value="monthly">מגמות חודשיות</TabsTrigger>
        <TabsTrigger value="summary">סיכום</TabsTrigger>
        <TabsTrigger value="balance">מאזן</TabsTrigger>
      </TabsList>
      
      <TabsContent value="monthly">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyStats}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => 
                  new Intl.NumberFormat('he-IL', {
                    style: 'currency',
                    currency: 'ILS'
                  }).format(value as number)
                }
                labelFormatter={(label) => `חודש: ${label}`}
              />
              <Legend />
              <Bar dataKey="income" name="הכנסות" fill="#3b82f6" />
              <Bar dataKey="expenses" name="הוצאות" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      
      <TabsContent value="summary">
        <div className="h-[400px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => 
                  new Intl.NumberFormat('he-IL', {
                    style: 'currency',
                    currency: 'ILS'
                  }).format(value as number)
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      
      <TabsContent value="balance">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyStats}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => 
                  new Intl.NumberFormat('he-IL', {
                    style: 'currency',
                    currency: 'ILS'
                  }).format(value as number)
                }
                labelFormatter={(label) => `חודש: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="balance" 
                name="מאזן" 
                stroke="#6E59A5" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  );
}
