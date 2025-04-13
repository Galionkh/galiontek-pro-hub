
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import FinanceChart from "@/components/dashboard/FinanceChart";
import TasksSummary from "@/components/dashboard/TasksSummary";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">דשבורד</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <WelcomeCard />
        <TasksSummary />
      </div>
      
      <FinanceChart />
    </div>
  );
}
