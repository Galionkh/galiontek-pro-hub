import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Loader2, 
  Pencil, 
  Trash, 
  ChevronLeft,
  ChevronRight,
  Filter,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, parseISO, isToday, isThisWeek, isThisMonth, addMonths } from "date-fns";
import { he } from "date-fns/locale";

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description?: string;
  created_at: string;
  user_id?: string;
};

// יצירת סכמת אימות עבור האירוע
const eventSchema = z.object({
  title: z.string().min(1, { message: "יש להזין כותרת" }),
  date: z.string().min(1, { message: "יש לבחור תאריך" }),
  location: z.string().min(1, { message: "יש להזין מיקום" }),
  description: z.string().optional(),
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
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      date: new Date().toISOString().split("T")[0],
      location: "",
      description: "",
    },
  });

  const editForm = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      date: "",
      location: "",
      description: "",
    },
  });

  useEffect(() => {
    if (user) {
      fetchEvents();
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
      
      const { error } = await supabase
        .from("events")
        .update({
          title: values.title,
          date: values.date,
          location: values.location,
          description: values.description,
        })
        .eq("id", currentEvent.id);

      if (error) throw error;

      toast({
        title: "עודכן בהצלחה",
        description: "האירוע עודכן בהצלחה",
      });

      fetchEvents();
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

      fetchEvents();
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
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, -1));
  };

  const filteredEvents = events.filter(event => {
    if (!searchTerm) return true;
    return event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const getEventsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateString);
  };

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

  const eventsDateMap = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const customDayClass = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return eventsDateMap[dateStr] ? 'bg-primary/20 font-bold rounded-full' : '';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <h1 className="text-3xl font-bold">יומן</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="חיפוש אירועים..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-10 w-full"
            />
          </div>
          <Button 
            variant="outline"
            onClick={() => setViewMode(viewMode === "calendar" ? "list" : "calendar")}
          >
            {viewMode === "calendar" ? "תצוגת רשימה" : "תצוגת לוח שנה"}
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setOpenCreateDialog(true)}
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
      </div>
      
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>אירוע חדש</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(createNewEvent)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>כותרת</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן כותרת לאירוע" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>תאריך</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מיקום</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן מיקום האירוע" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>תיאור (אופציונלי)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="הזן תיאור לאירוע"
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  צור אירוע
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>עריכת אירוע</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(updateEvent)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>כותרת</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן כותרת לאירוע" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>תאריך</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מיקום</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן מיקום האירוע" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>תיאור (אופציונלי)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="הזן תיאור לאירוע"
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  עדכן אירוע
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Card className="p-6">
        {isLoadingEvents ? (
          <div className="flex flex-col items-center justify-center h-[500px]">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-muted-foreground">טוען אירועים...</p>
          </div>
        ) : events.length > 0 ? (
          viewMode === "calendar" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-medium">
                  {format(currentMonth, 'MMMM yyyy', { locale: he })}
                </h2>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    className="rounded-md border pointer-events-auto"
                    locale={he}
                    modifiersClassNames={{
                      selected: 'bg-primary text-primary-foreground',
                    }}
                    modifiersStyles={{
                      today: { 
                        fontWeight: 'bold',
                        border: '2px solid currentColor',
                      }
                    }}
                    components={{
                      Day: ({ date, ...props }) => {
                        const eventDate = format(date, 'yyyy-MM-dd');
                        const hasEvents = eventsDateMap[eventDate]?.length > 0;
                        
                        return (
                          <div className={`relative ${String(props.className || '')} ${customDayClass(date)}`}>
                            <div {...props}>
                              {date.getDate()}
                            </div>
                            {hasEvents && (
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                            )}
                          </div>
                        );
                      }
                    }}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">
                    {format(selectedDate, 'EEEE, d בMMMM yyyy', { locale: he })}
                  </h3>
                  
                  {getEventsForDate(selectedDate).length > 0 ? (
                    <div className="space-y-3">
                      {getEventsForDate(selectedDate).map(event => (
                        <div key={event.id} className="bg-accent/50 p-4 rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{event.title}</h3>
                              <p className="mt-1">{event.location}</p>
                              {event.description && (
                                <p className="mt-2 text-sm">{event.description}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openEditMode(event)}
                              >
                                <Pencil className="h-4 w-4 mr-1" />
                                ערוך
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => deleteEvent(event.id)}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                מחק
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground border rounded-md">
                      <CalendarIcon className="h-10 w-10 mx-auto mb-2" />
                      <p>אין אירועים בתאריך זה</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => {
                          form.setValue('date', format(selectedDate, 'yyyy-MM-dd'));
                          setOpenCreateDialog(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        הוסף אירוע
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8">
                <Tabs defaultValue="today">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="today">היום ({todayEvents.length})</TabsTrigger>
                    <TabsTrigger value="week">השבוע ({thisWeekEvents.length})</TabsTrigger>
                    <TabsTrigger value="month">החודש ({thisMonthEvents.length})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="today" className="mt-4">
                    {todayEvents.length > 0 ? (
                      <div className="space-y-3">
                        {todayEvents.map(event => (
                          <div key={event.id} className="bg-accent/50 p-4 rounded-md">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-lg">{event.title}</h3>
                                <p className="mt-1">{event.location}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openEditMode(event)}
                                >
                                  <Pencil className="h-4 w-4 mr-1" />
                                  ערוך
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>אין אירועים להיום</p>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="week" className="mt-4">
                    {thisWeekEvents.length > 0 ? (
                      <div className="space-y-3">
                        {thisWeekEvents.map(event => (
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
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openEditMode(event)}
                                >
                                  <Pencil className="h-4 w-4 mr-1" />
                                  ערוך
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>אין אירועים לשבוע הקרוב</p>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="month" className="mt-4">
                    {thisMonthEvents.length > 0 ? (
                      <div className="space-y-3">
                        {thisMonthEvents.map(event => (
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
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openEditMode(event)}
                                >
                                  <Pencil className="h-4 w-4 mr-1" />
                                  ערוך
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>אין אירועים לחודש הקרוב</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
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
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openEditMode(event)}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              ערוך
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => deleteEvent(event.id)}
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              מחק
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
