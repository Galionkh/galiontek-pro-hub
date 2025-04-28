
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Filter, Plus, Search, Upload, Download, Loader2 } from "lucide-react";
import { useRef } from "react";

interface CalendarHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterMode: "all" | "today" | "week" | "month";
  setFilterMode: (mode: "all" | "today" | "week" | "month") => void;
  viewMode: "calendar" | "list";
  setViewMode: (mode: "calendar" | "list") => void;
  isLoading: boolean;
  onCreateClick: () => void;
  onExportEvents: () => void;
  onImportEvents: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CalendarHeader = ({
  searchTerm,
  setSearchTerm,
  filterMode,
  setFilterMode,
  viewMode,
  setViewMode,
  isLoading,
  onCreateClick,
  onExportEvents,
  onImportEvents
}: CalendarHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
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
          onClick={onCreateClick}
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
                onClick={onExportEvents}
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
                onChange={onImportEvents}
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
    </div>
  );
};
