import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description?: string;
  created_at: string;
  user_id?: string;
};

export default function Calendar() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoadingEvents(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching events:", error.message);
      toast({
        title: "שגיאה בטעינת אירועים",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const createNewEvent = async () => {
    if (!user) {
      toast({
        title: "יש להתחבר תחילה",
        description: "עליך להתחבר כדי ליצור אירוע חדש",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const { data, error } = await supabase
        .from("events")
        .insert([
          {
            title: "אירוע חדש",
            date: tomorrow.toISOString().split("T")[0],
            location: "יש להגדיר מיקום",
            description: "פרטי האירוע",
            user_id: user.id
          },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "נוצר בהצלחה",
        description: "האירוע החדש נוצר בהצלחה",
      });

      fetchEvents();
    } catch (error: any) {
      console.error("Error creating event:", error.message);
      toast({
        title: "שגיאה ביצירת אירוע",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const groupedEvents = events.reduce((groups, event) => {
    const date = new Date(event.date);
    const month = date.toLocaleString('he-IL', { month: 'long', year: 'numeric' });
    
    if (!groups[month]) {
      groups[month] = [];
    }
    
    groups[month].push(event);
    return groups;
  }, {} as Record<string, Event[]>);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">יומן</h1>
        <Button 
          className="flex items-center gap-2"
          onClick={createNewEvent}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          <span>אירוע חדש</span>
        </Button>
      </div>
      
      <Card className="p-6">
        {isLoadingEvents ? (
          <div className="flex flex-col items-center justify-center h-[500px]">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-muted-foreground">טוען אירועים...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedEvents).map(([month, monthEvents]) => (
              <div key={month} className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">{month}</h2>
                <div className="space-y-3">
                  {monthEvents.map(event => (
                    <div key={event.id} className="bg-accent/50 p-4 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{event.title}</h3>
                          <p className="text-muted-foreground text-sm">
                            {new Date(event.date).toLocaleDateString('he-IL', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long' 
                            })}
                          </p>
                          <p className="mt-1">{event.location}</p>
                          {event.description && (
                            <p className="mt-2 text-sm">{event.description}</p>
                          )}
                        </div>
                        <Button variant="outline" size="sm">ערוך</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
            <CalendarIcon className="h-16 w-16 mb-4" />
            <h2 className="text-xl font-semibold mb-2">אין אירועים ביומן</h2>
            <p className="mb-4">לחץ על "אירוע חדש" כדי להוסיף את האירוע הראשון שלך</p>
            <Button
              onClick={createNewEvent}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>הוסף אירוע</span>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
