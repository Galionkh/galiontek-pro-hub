
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/hooks/useTransactions";

export default function MeetingsSummary() {
  const navigate = useNavigate();
  const { transactions, isLoading } = useTransactions();
  
  // Get most recent income transactions
  const recentIncomes = transactions
    .filter(transaction => transaction.type === 'income')
    .slice(0, 3);
  
  // Calculate total income for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthIncomes = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transaction.type === 'income' && 
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });
  
  const totalMonthlyIncome = currentMonthIncomes.reduce(
    (sum, transaction) => sum + transaction.amount, 
    0
  );
  
  const handleNavigateToFinances = () => {
    navigate('/finances');
  };
  
  return (
    <Card className="card-hover cursor-pointer" onClick={handleNavigateToFinances}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>הכנסות אחרונות</span>
          <Clock className="h-5 w-5 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('he-IL', {
              style: 'currency',
              currency: 'ILS',
              maximumFractionDigits: 0
            }).format(totalMonthlyIncome)}
          </div>
          <p className="text-sm text-muted-foreground">הכנסות החודש</p>
        </div>
        
        {recentIncomes.length > 0 ? (
          <ul className="space-y-2">
            {recentIncomes.map(income => (
              <li key={income.id} className="flex justify-between items-center text-sm">
                <span className="truncate max-w-[180px]">{income.description || 'הכנסה'}</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('he-IL', {
                    style: 'currency',
                    currency: 'ILS'
                  }).format(income.amount)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">אין הכנסות אחרונות</p>
        )}
      </CardContent>
    </Card>
  );
}
