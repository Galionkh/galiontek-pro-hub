
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Event } from "../types";

interface UseRealTimeEventsProps {
  userId?: string;
}

export function useRealTimeEvents({ userId }: UseRealTimeEventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setEvents([]);
      setIsLoading(false);
      return;
    }
    
    fetchEvents();
    
    // הוספת הקשבה לשינויים בזמן אמת בטבלת האירועים
    const channel = supabase
      .channel('public:events')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'events' },
        (payload) => {
          console.log('Real-time event received:', payload);
          fetchEvents(); // רענון האירועים כשיש שינוי
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { events, isLoading, fetchEvents };
}
