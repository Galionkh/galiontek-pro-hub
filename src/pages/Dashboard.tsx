
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import FinanceChart from "@/components/dashboard/FinanceChart";
import TasksSummary from "@/components/dashboard/TasksSummary";
import OrdersSummary from "@/components/dashboard/OrdersSummary";
import MeetingsSummary from "@/components/dashboard/MeetingsSummary";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUpcomingEvents();
    } else {
      setUpcomingEvents([]);
      setIsLoadingEvents(false);
    }
  }, [user]);

  const fetchUpcomingEvents = async () => {
    try {
      setIsLoadingEvents(true);
      // מתאריך היום ועד חודש קדימה
      const today = new Date().toISOString().split('T')[0];
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthStr = nextMonth.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from("events")
        .select("id, title, date, location")
        .gte("date", today)
        .lte("date", nextMonthStr)
        .order("date", { ascending: true })
        .limit(5);

      if (error) throw error;
      setUpcomingEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching upcoming events:", error.message);
    } finally {
      setIsLoadingEvents(false);
    }
  };

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

      {/* אירועים קרובים */}
      <Card className="card-hover">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle>
            אירועים קרובים
          </CardTitle>
          <button 
            onClick={() => navigate('/calendar')}
            className="text-sm text-primary"
          >
            לכל האירועים
          </button>
        </CardHeader>
        <CardContent>
          {isLoadingEvents ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div 
                  key={event.id} 
                  className="flex items-start space-x-4 space-x-reverse rtl:space-x-reverse p-3 hover:bg-accent/50 rounded-md transition-colors"
                >
                  <div className="flex-shrink-0 p-2 bg-primary/10 rounded-md">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.date), 'EEEE, d בMMMM', { locale: he })}
                    </p>
                    <p className="text-sm">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>אין אירועים קרובים</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
