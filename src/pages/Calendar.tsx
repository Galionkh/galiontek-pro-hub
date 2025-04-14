
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Plus, Loader2, Pencil, Trash } from "lucide-react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

export default function Calendar() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  // יצירת טופס עם ערכי ברירת מחדל
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      date: new Date().toISOString().split("T")[0],
      location: "",
      description: "",
    },
  });

  // יצירת טופס עבור עריכת אירוע
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

  // עדכון ערכי הטופס כשבוחרים אירוע לעריכה
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
      
      {/* דיאלוג יצירת אירוע חדש */}
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
      
      {/* דיאלוג עריכת אירוע */}
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
