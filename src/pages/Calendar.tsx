import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, isToday, isThisWeek, isThisMonth, addMonths } from "date-fns";
import { he } from "date-fns/locale";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  exportEventsToICS, 
  importEventsFromICS
} from "@/features/meetings/utils/calendarUtils";
import { CalendarHeader } from "@/features/calendar/components/CalendarHeader";
import { EventDialog } from "@/features/calendar/components/EventDialog";
import { CalendarView } from "@/features/calendar/components/CalendarView";
import { ListView } from "@/features/calendar/components/ListView";
import { EventTabs } from "@/features/calendar/components/EventTabs";
import type { Event } from "@/features/calendar/types";

const eventSchema = z.object({
  title: z.string().min(1, { message: "יש להזין כותרת" }),
  date: z.string().min(1, { message: "יש לבחור תאריך" }),
  location: z.string().min(1, { message: "יש להזין מיקום" }),
  description: z.string().optional(),
  is_recurring: z.boolean().optional().default(false),
  recurrence_pattern: z.string().optional(),
  reminder: z.boolean().optional().default(false),
  reminder_time: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function CalendarPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "today" | "week" | "month">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      date: new Date().toISOString().split("T")[0],
      location: "",
      description: "",
      is_recurring: false,
      recurrence_pattern: "weekly",
      reminder: false,
      reminder_time: "30",
    },
  });

  const editForm = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      date: "",
      location: "",
      description: "",
      is_recurring: false,
      recurrence_pattern: "weekly",
      reminder: false,
      reminder_time: "30",
    },
  });

  useEffect(() => {
    if (user) {
      fetchEvents();
      
      const channel = supabase
        .channel('public:events')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'events' },
          (payload) => {
            console.log('Real-time event received:', payload);
            fetchEvents();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setEvents([]);
      setIsLoadingEvents(false);
    }
  }, [user]);

  useEffect(() => {
    if (currentEvent) {
      editForm.reset({
        title: currentEvent.title,
        date: currentEvent.date,
        location: currentEvent.location,
        description: currentEvent.description || "",
        is_recurring: currentEvent.is_recurring || false,
        recurrence_pattern: currentEvent.recurrence_pattern || "weekly",
        reminder: currentEvent.reminder || false,
        reminder_time: currentEvent.reminder_time || "30",
      });
    }
  }, [currentEvent, editForm]);

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

  const createNewEvent = async (values: EventFormValues) => {
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
      
      const { data, error } = await supabase
        .from("events")
        .insert([
          {
            title: values.title,
            date: values.date,
            location: values.location,
            description: values.description,
            user_id: user.id,
            is_recurring: values.is_recurring,
            recurrence_pattern: values.is_recurring ? values.recurrence_pattern : null,
            reminder: values.reminder,
            reminder_time: values.reminder ? values.reminder_time : null,
          },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "נוצר בהצלחה",
        description: "האירוע החדש נוצר בהצלחה",
      });

      if (data) {
        setEvents(prevEvents => [...prevEvents, ...data]);
      }
      
      setOpenCreateDialog(false);
      form.reset();
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

  const updateEvent = async (values: EventFormValues) => {
    if (!user || !currentEvent) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("events")
        .update({
          title: values.title,
          date: values.date,
          location: values.location,
          description: values.description,
          is_recurring: values.is_recurring,
          recurrence_pattern: values.is_recurring ? values.recurrence_pattern : null,
          reminder: values.reminder,
          reminder_time: values.reminder ? values.reminder_time : null,
        })
        .eq("id", currentEvent.id)
        .select();

      if (error) throw error;

      toast({
        title: "עודכן בהצלחה",
        description: "האירוע עודכן בהצלחה",
      });

      if (data && data.length > 0) {
        setEvents(prevEvents => prevEvents.map(event => 
          event.id === currentEvent.id ? data[0] : event
        ));
      }

      setOpenEditDialog(false);
      setCurrentEvent(null);
    } catch (error: any) {
      console.error("Error updating event:", error.message);
      toast({
        title: "שגיאה בעדכון האירוע",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (id: number) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "נמחק בהצלחה",
        description: "האירוע נמחק בהצלחה",
      });

      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    } catch (error: any) {
      console.error("Error deleting event:", error.message);
      toast({
        title: "שגיאה במחיקת אירוע",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditMode = (event: Event) => {
    setCurrentEvent(event);
    setOpenEditDialog(true);
  };

  const nextMonth = () => {
    const nextDate = addMonths(currentMonth, 1);
    setCurrentMonth(nextDate);
  };

  const prevMonth = () => {
    const prevDate = addMonths(currentMonth, -1);
    setCurrentMonth(prevDate);
  };

  const handleExportEvents = async () => {
    try {
      setIsLoading(true);
      const icsContent = await exportEventsToICS(events);
      
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'my_events.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "יצוא הושלם בהצלחה",
        description: "האירועים יוצאו לקובץ ICS",
      });
    } catch (error: any) {
      console.error("Error exporting events:", error);
      toast({
        title: "שגיאה ביצוא אירועים",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportEvents = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
      
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = async (e) => {
          try {
            if (e.target && typeof e.target.result === 'string') {
              const icsContent = e.target.result;
              const importedEvents = await importEventsFromICS(icsContent);
              
              for (const event of importedEvents) {
                await supabase.from("events").insert([
                  {
                    title: event.title,
                    date: event.date,
                    location: event.location || "",
                    description: event.description || "",
                    user_id: user?.id,
                  },
                ]);
              }
              
              toast({
                title: "ייבוא הושלם בהצלחה",
                description: `יובאו ${importedEvents.length} אירועים`,
              });
              
              fetchEvents();
            }
          } catch (error: any) {
            console.error("Error processing imported file:", error);
            toast({
              title: "שגיאה בעיבוד הקובץ",
              description: error.message,
              variant: "destructive",
            });
          }
        };
        
        reader.readAsText(file);
      }
    } catch (error: any) {
      console.error("Error importing events:", error);
      toast({
        title: "שגיאה בייבוא אירועים",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const eventsDateMap = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const filteredEvents = events.filter(event => {
    if (!searchTerm) return true;
    return event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const todayEvents = filteredEvents.filter(event => isToday(new Date(event.date)));
  const thisWeekEvents = filteredEvents.filter(event => isThisWeek(new Date(event.date)));
  const thisMonthEvents = filteredEvents.filter(event => isThisMonth(new Date(event.date)));

  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const date = new Date(event.date);
    const month = format(date, 'MMMM yyyy', { locale: he });
    
    if (!groups[month]) {
      groups[month] = [];
    }
    
    groups[month].push(event);
    return groups;
  }, {} as Record<string, Event[]>);

  return (
    <div className="space-y-6 animate-fade-in">
      <CalendarHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isLoading={isLoading}
        onCreateClick={() => setOpenCreateDialog(true)}
        onExportEvents={handleExportEvents}
        onImportEvents={handleImportEvents}
      />
      
      <EventDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        form={form}
        onSubmit={createNewEvent}
        isLoading={isLoading}
        mode="create"
      />
      
      <EventDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        form={editForm}
        onSubmit={updateEvent}
        isLoading={isLoading}
        mode="edit"
      />
      
      <Card className="p-6">
        {isLoadingEvents ? (
          <div className="flex flex-col items-center justify-center h-[500px]">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-muted-foreground">טוען אירועים...</p>
          </div>
        ) : events.length > 0 ? (
          viewMode === "calendar" ? (
            <div>
              <CalendarView
                events={events}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                openCreateDialog={() => {
                  form.setValue('date', format(selectedDate, 'yyyy-MM-dd'));
                  setOpenCreateDialog(true);
                }}
                onEventEdit={openEditMode}
                onEventDelete={deleteEvent}
                eventsDateMap={eventsDateMap}
              />
              
              <div className="mt-8">
                <EventTabs
                  todayEvents={todayEvents}
                  thisWeekEvents={thisWeekEvents}
                  thisMonthEvents={thisMonthEvents}
                  onEventEdit={openEditMode}
                  onEventDelete={deleteEvent}
                />
              </div>
            </div>
          ) : (
            <ListView
              groupedEvents={groupedEvents}
              onEventEdit={openEditMode}
              onEventDelete={deleteEvent}
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
            <CalendarIcon className="h-16 w-16 mb-4" />
            <h2 className="text-xl font-semibold mb-2">אין אירועים ביומן</h2>
            <p className="mb-4">לחץ על "אירוע חדש" כדי להוסיף את האירוע הראשון שלך</p>
            <Button
              onClick={() => setOpenCreateDialog(true)}
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
