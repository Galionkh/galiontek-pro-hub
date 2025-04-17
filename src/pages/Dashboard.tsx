
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import FinanceChart from "@/components/dashboard/FinanceChart";
import TasksSummary from "@/components/dashboard/TasksSummary";
import OrdersSummary from "@/components/dashboard/OrdersSummary";
import MeetingsSummary from "@/components/dashboard/MeetingsSummary";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <h1 className="text-3xl font-bold">דשבורד</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <WelcomeCard />
        <OrdersSummary />
        <MeetingsSummary />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <TasksSummary />
        <FinanceChart />
      </div>
    </div>
  );
}
