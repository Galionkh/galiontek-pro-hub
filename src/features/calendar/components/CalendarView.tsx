
import { useState } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, addMonths } from "date-fns";
import { he } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Event } from "../types";
import { EventCard } from "./EventCard";

interface CalendarViewProps {
  events: Event[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  openCreateDialog: () => void;
  onEventEdit: (event: Event) => void;
  onEventDelete: (id: number) => void;
  eventsDateMap: Record<string, Event[]>;
}

export const CalendarView = ({
  events,
  selectedDate,
  setSelectedDate,
  currentMonth,
  setCurrentMonth,
  openCreateDialog,
  onEventEdit,
  onEventDelete,
  eventsDateMap
}: CalendarViewProps) => {
  const nextMonth = () => {
    const nextDate = addMonths(currentMonth, 1);
    setCurrentMonth(nextDate);
  };

  const prevMonth = () => {
    const prevDate = addMonths(currentMonth, -1);
    setCurrentMonth(prevDate);
  };

  const getEventsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateString);
  };

  const customDayClass = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return eventsDateMap[dateStr] ? 'bg-primary/20 font-bold rounded-full' : '';
  };

  return (
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
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={() => onEventEdit(event)}
                  onDelete={() => onEventDelete(event.id)}
                />
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
                onClick={openCreateDialog}
              >
                <Plus className="h-4 w-4 mr-1" />
                הוסף אירוע
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
