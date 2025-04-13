
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Sample data for the finance chart
const data = [
  { month: "ינו", income: 4000, expenses: 2400 },
  { month: "פבר", income: 3000, expenses: 1398 },
  { month: "מרץ", income: 2000, expenses: 9800 },
  { month: "אפר", income: 2780, expenses: 3908 },
  { month: "מאי", income: 1890, expenses: 4800 },
  { month: "יוני", income: 2390, expenses: 3800 },
];

export default function FinanceChart() {
  return (
    <Card className="h-[400px] card-hover">
      <CardHeader className="pb-2">
        <CardTitle>סיכום כספי</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value) => new Intl.NumberFormat('he-IL', { 
                style: 'currency', 
                currency: 'ILS'
              }).format(value as number)}
              labelFormatter={(label) => `חודש: ${label}`}
            />
            <Bar dataKey="income" name="הכנסות" fill="#6E59A5" />
            <Bar dataKey="expenses" name="הוצאות" fill="#E5DEFF" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
