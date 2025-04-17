
import { useState, useEffect, useRef } from "react";
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
  Search,
  Download,
  Upload,
  Repeat,
  Bell,
  Share2
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, parseISO, isToday, isThisWeek, isThisMonth, addMonths } from "date-fns";
import { he } from "date-fns/locale";
import { 
  exportEventsToICS, 
  importEventsFromICS
} from "@/features/meetings/utils/calendarUtils";

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description?: string;
  created_at: string;
  user_id?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  reminder?: boolean;
  reminder_time?: string;
};

// יצירת סכמת אימות עבור האירוע
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
          is_recurring: values.is_recurring,
          recurrence_pattern: values.is_recurring ? values.recurrence_pattern : null,
          reminder: values.reminder,
          reminder_time: values.reminder ? values.reminder_time : null,
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

  const handleExportEvents = async () => {
    try {
      setIsLoading(true);
      const icsContent = await exportEventsToICS(events);
      
      // Create blob and download link
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
              
              // ייבוא האירועים לבסיס הנתונים
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
      // נקה את הקובץ שנבחר כדי לאפשר בחירה חוזרת של אותו קובץ
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // סינון אירועים על פי חיפוש
  const filteredEvents = events.filter(event => {
    if (!searchTerm) return true;
    return event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // קבלת אירועים לפי תאריך ספציפי
  const getEventsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateString);
  };

  // סידור האירועים לפי קבוצות - היום, השבוע, החודש, הכל
  const todayEvents = filteredEvents.filter(event => isToday(new Date(event.date)));
  const thisWeekEvents = filteredEvents.filter(event => isThisWeek(new Date(event.date)));
  const thisMonthEvents = filteredEvents.filter(event => isThisMonth(new Date(event.date)));

  // יצירת הרשימה הקבוצתית
  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const date = new Date(event.date);
    const month = format(date, 'MMMM yyyy', { locale: he });
    
    if (!groups[month]) {
      groups[month] = [];
    }
    
    groups[month].push(event);
    return groups;
  }, {} as Record<string, Event[]>);

  // יצירת פונקציה שתמפה ימים עם אירועים לשימוש ב-DayPicker
  const eventsDateMap = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // CSS מותאם להדגשת תאריכים עם אירועים
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                סינון
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-2">
                <h4 className="font-medium">הצג אירועים</h4>
                <div className="space-y-1">
                  <Button 
                    variant={filterMode === "all" ? "default" : "outline"} 
                    className="w-full justify-start"
                    onClick={() => setFilterMode("all")}
                  >
                    כל האירועים
                  </Button>
                  <Button 
                    variant={filterMode === "today" ? "default" : "outline"} 
                    className="w-full justify-start"
                    onClick={() => setFilterMode("today")}
                  >
                    היום
                  </Button>
                  <Button 
                    variant={filterMode === "week" ? "default" : "outline"} 
                    className="w-full justify-start"
                    onClick={() => setFilterMode("week")}
                  >
                    השבוע
                  </Button>
                  <Button 
                    variant={filterMode === "month" ? "default" : "outline"} 
                    className="w-full justify-start"
                    onClick={() => setFilterMode("month")}
                  >
                    החודש
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
      
      <div className="flex gap-2 flex-wrap">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>ייצוא</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleExportEvents}
                disabled={isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                ייצוא לקובץ ICS
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>ייבוא</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".ics"
                onChange={handleImportEvents}
                className="hidden"
                id="import-file"
              />
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Upload className="h-4 w-4 mr-2" />
                ייבוא מקובץ ICS
              </Button>
            </div>
          </PopoverContent>
        </Popover>
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
              
              <div className="space-y-4 border rounded-md p-4">
                <h3 className="font-medium">הגדרות מתקדמות</h3>
                
                <FormField
                  control={form.control}
                  name="is_recurring"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rtl:space-x-reverse">
                      <FormLabel>אירוע חוזר</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {form.watch("is_recurring") && (
                  <FormField
                    control={form.control}
                    name="recurrence_pattern"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>תדירות</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="בחר תדירות" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">יומי</SelectItem>
                            <SelectItem value="weekly">שבועי</SelectItem>
                            <SelectItem value="monthly">חודשי</SelectItem>
                            <SelectItem value="yearly">שנתי</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="reminder"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rtl:space-x-reverse">
                      <FormLabel>תזכורת</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {form.watch("reminder") && (
                  <FormField
                    control={form.control}
                    name="reminder_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>זמן תזכורת (דקות לפני האירוע)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="בחר זמן" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5">5 דקות לפני</SelectItem>
                            <SelectItem value="10">10 דקות לפני</SelectItem>
                            <SelectItem value="15">15 דקות לפני</SelectItem>
                            <SelectItem value="30">30 דקות לפני</SelectItem>
                            <SelectItem value="60">שעה לפני</SelectItem>
                            <SelectItem value="120">שעתיים לפני</SelectItem>
                            <SelectItem value="1440">יום לפני</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
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
              
              <div className="space-y-4 border rounded-md p-4">
                <h3 className="font-medium">הגדרות מתקדמות</h3>
                
                <FormField
                  control={editForm.control}
                  name="is_recurring"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rtl:space-x-reverse">
                      <FormLabel>אירוע חוזר</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {editForm.watch("is_recurring") && (
                  <FormField
                    control={editForm.control}
                    name="recurrence_pattern"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>תדירות</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="בחר תדירות" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">יומי</SelectItem>
                            <SelectItem value="weekly">שבועי</SelectItem>
                            <SelectItem value="monthly">חודשי</SelectItem>
                            <SelectItem value="yearly">שנתי</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={editForm.control}
                  name="reminder"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rtl:space-x-reverse">
                      <FormLabel>תזכורת</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {editForm.watch("reminder") && (
                  <FormField
                    control={editForm.control}
                    name="reminder_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>זמן תזכורת (דקות לפני האירוע)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="בחר זמן" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5">5 דקות לפני</SelectItem>
                            <SelectItem value="10">10 דקות לפני</SelectItem>
                            <SelectItem value="15">15 דקות לפני</SelectItem>
                            <SelectItem value="30">30 דקות לפני</SelectItem>
                            <SelectItem value="60">שעה לפני</SelectItem>
                            <SelectItem value="120">שעתיים לפני</SelectItem>
                            <SelectItem value="1440">יום לפני</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
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
                    className="rounded-md border"
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
                      Day: ({ date, ...props }: React.ComponentProps<'div'> & { date: Date }) => {
                        const eventDate = format(date, 'yyyy-MM-dd');
                        const hasEvents = eventsDateMap[eventDate]?.length > 0;
                        
                        return (
                          <div className={`relative ${props.className || ''} ${customDayClass(date)}`}>
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
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-lg">{event.title}</h3>
                                {event.is_recurring && (
                                  <Badge variant="secondary" className="flex items-center gap-1">
                                    <Repeat className="h-3 w-3" />
                                    חוזר
                                  </Badge>
                                )}
                                {event.reminder && (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Bell className="h-3 w-3" />
                                    תזכורת
                                  </Badge>
                                )}
                              </div>
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
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-lg">{event.title}</h3>
                                  {event.is_recurring && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                      <Repeat className="h-3 w-3" />
                                      חוזר
                                    </Badge>
                                  )}
                                </div>
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
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-lg">{event.title}</h3>
                                  {event.is_recurring && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                      <Repeat className="h-3 w-3" />
                                      חוזר
                                    </Badge>
                                  )}
                                </div>
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
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-lg">{event.title}</h3>
                                  {event.is_recurring && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                      <Repeat className="h-3 w-3" />
                                      חוזר
                                    </Badge>
                                  )}
                                </div>
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
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-lg">{event.title}</h3>
                              {event.is_recurring && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Repeat className="h-3 w-3" />
                                  חוזר
                                </Badge>
                              )}
                              {event.reminder && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Bell className="h-3 w-3" />
                                  תזכורת
                                </Badge>
                              )}
                            </div>
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
