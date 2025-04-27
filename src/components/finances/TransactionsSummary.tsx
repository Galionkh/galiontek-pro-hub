
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Transaction } from "@/hooks/useTransactions";

interface TransactionsSummaryProps {
  transactions: Transaction[];
}

export function TransactionsSummary({ transactions }: TransactionsSummaryProps) {
  // Skip if no transactions
  if (transactions.length === 0) return null;
  
  // Group transactions by month
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
  
  // Convert to array and sort by date (newest first)
  const monthlyStats = Object.entries(monthlyData)
    .map(([monthYear, stats]) => {
      const [year, month] = monthYear.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      
      return {
        monthYear,
        monthName: new Intl.DateTimeFormat('he-IL', { month: 'long' }).format(date),
        year: date.getFullYear(),
        income: stats.income,
        expense: stats.expense,
        balance: stats.income - stats.expense
      };
    })
    .sort((a, b) => b.monthYear.localeCompare(a.monthYear));
  
  // Only show the last 6 months
  const recentMonthlyStats = monthlyStats.slice(0, 6);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>סיכום חודשי</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">חודש</TableHead>
              <TableHead className="text-right">הכנסות</TableHead>
              <TableHead className="text-right">הוצאות</TableHead>
              <TableHead className="text-right">מאזן</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentMonthlyStats.map((stat) => (
              <TableRow key={stat.monthYear}>
                <TableCell className="font-medium">
                  {stat.monthName} {stat.year}
                </TableCell>
                <TableCell className="text-green-600">
                  {stat.income.toLocaleString('he-IL', {
                    style: 'currency',
                    currency: 'ILS'
                  })}
                </TableCell>
                <TableCell className="text-red-600">
                  {stat.expense.toLocaleString('he-IL', {
                    style: 'currency',
                    currency: 'ILS'
                  })}
                </TableCell>
                <TableCell className={stat.balance >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                  {stat.balance.toLocaleString('he-IL', {
                    style: 'currency',
                    currency: 'ILS'
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
