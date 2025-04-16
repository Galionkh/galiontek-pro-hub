
import React, { useEffect, useState, useRef } from "react";
import { Plus, FileDown, Mail, FileSpreadsheet, Share, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MeetingForm } from "./MeetingForm";
import { MeetingsList } from "./MeetingsList";
import { MeetingsSummary } from "./MeetingsSummary";
import { useMeetings } from "@/hooks/useMeetings";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/features/clients/types";
import type { Meeting } from "@/hooks/useMeetings";
import { exportToPDF, shareViaWhatsApp, sendEmail } from "@/utils/meetingExports";
import { supabase } from "@/integrations/supabase/client";

interface MeetingsTabProps {
  order: Order;
}

export const MeetingsTab: React.FC<MeetingsTabProps> = ({ order }) => {
  const {
    meetings,
    isLoading,
    isCreating,
    isMeetingFormOpen,
    fetchMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    openMeetingForm,
    closeMeetingForm,
    getMeetingsSummary,
    importFromExcel
  } = useMeetings(order.id);

  const { toast } = useToast();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [use45MinuteUnits, setUse45MinuteUnits] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { totalMeetings, totalHours, totalTeachingUnits } = getMeetingsSummary(use45MinuteUnits);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    openMeetingForm();
  };

  const handleCloseForm = () => {
    setSelectedMeeting(null);
    closeMeetingForm();
  };

  const handleFormSubmit = async (meetingData: any) => {
    try {
      if (selectedMeeting) {
        await updateMeeting(selectedMeeting.id, meetingData);
        toast({
          title: "מפגש עודכן",
          description: "המפגש עודכן בהצלחה",
        });
      } else {
        // Remove use45MinuteUnits from meetingData to avoid database errors
        const { use45MinuteUnits: _, ...meetingDataToSave } = meetingData;
        
        await createMeeting({
          ...meetingDataToSave,
        });
        toast({
          title: "מפגש נוסף",
          description: "המפגש נוסף בהצלחה",
        });
      }
      handleCloseForm();
    } catch (error) {
      console.error("Error saving meeting:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשמירת המפגש",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importFromExcel(file, use45MinuteUnits);
      toast({
        title: "ייבוא הושלם",
        description: "המפגשים יובאו בהצלחה מקובץ האקסל",
      });
    } catch (error) {
      console.error("Error importing from Excel:", error);
      toast({
        title: "שגיאה בייבוא",
        description: "אירעה שגיאה בייבוא המפגשים מקובץ האקסל",
        variant: "destructive",
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExportToPDF = async () => {
    try {
      await exportToPDF(order, meetings, use45MinuteUnits);
      toast({
        title: "ייצוא ל־PDF",
        description: "המפגשים יוצאו בהצלחה לקובץ PDF",
      });
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast({
        title: "שגיאה בייצוא",
        description: "אירעה שגיאה בייצוא המפגשים ל־PDF",
        variant: "destructive",
      });
    }
  };

  const handleShareViaWhatsApp = async () => {
    try {
      await shareViaWhatsApp(order, meetings, use45MinuteUnits);
      toast({
        title: "שיתוף בוואטסאפ",
        description: "המפגשים שותפו בהצלחה",
      });
    } catch (error) {
      console.error("Error sharing via WhatsApp:", error);
      toast({
        title: "שגיאה בשיתוף",
        description: "אירעה שגיאה בשיתוף המפגשים בוואטסאפ",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = async () => {
    try {
      if (order.client_id) {
        // Convert client_id to number if it's a string
        const clientId = typeof order.client_id === 'string' ? parseInt(order.client_id, 10) : order.client_id;
        
        // Use non-typed query to avoid TypeScript issues with column detection
        const { data, error } = await supabase
          .from("clients")
          .select("email")
          .eq("id", clientId)
          .single();
          
        if (error) throw error;
        
        // Type guard to ensure data exists and has email property
        if (!data) {
          toast({
            title: "לקוח לא נמצא",
            description: "לא נמצאו פרטי לקוח. ערוך את פרטי הלקוח כדי להמשיך.",
            variant: "destructive",
          });
          return;
        }
        
        // Check if data has email property and if it has a value
        if (!data.email) {
          toast({
            title: "חסר דואר אלקטרוני",
            description: "לא נמצא דואר אלקטרוני ללקוח. ערוך את פרטי הלקוח כדי להוסיף דואר אלקטרוני.",
            variant: "destructive",
          });
          return;
        }
      }
      
      await sendEmail(order, meetings, use45MinuteUnits);
      toast({
        title: "שליחה למייל",
        description: "המפגשים נשלחו בהצלחה למייל",
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "שגיאה בשליחה",
        description: "אירעה שגיאה בשליחת המפגשים למייל",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">מפגשי שירות</h3>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2 ml-4">
            <Switch
              id="use45MinuteUnits"
              checked={use45MinuteUnits}
              onCheckedChange={setUse45MinuteUnits}
            />
            <Label htmlFor="use45MinuteUnits" className="mr-2">חישוב לפי יחידות הוראה (45 דקות)</Label>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange} 
            accept=".xlsx,.xls" 
            className="hidden" 
            id="excel-import" 
          />
          
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <FileSpreadsheet className="h-4 w-4 ml-2" />
            ייבוא מאקסל
          </Button>
          
          <Button onClick={openMeetingForm}>
            <Plus className="h-4 w-4 ml-2" />
            הוסף מפגש
          </Button>
        </div>
      </div>

      <MeetingsSummary
        totalMeetings={totalMeetings}
        totalHours={totalHours}
        totalTeachingUnits={totalTeachingUnits}
        agreedHours={order.hours || null}
        use45MinuteUnits={use45MinuteUnits}
      />

      <MeetingsList
        meetings={meetings}
        isLoading={isLoading}
        onDelete={deleteMeeting}
        onEdit={handleEditMeeting}
        use45MinuteUnits={use45MinuteUnits}
      />

      {meetings.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-wrap gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleExportToPDF}>
              <FileDown className="h-4 w-4 ml-2" />
              ייצוא ל־PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareViaWhatsApp}>
              <Share className="h-4 w-4 ml-2" />
              שלח בוואטסאפ
            </Button>
            <Button variant="outline" size="sm" onClick={handleSendEmail}>
              <Mail className="h-4 w-4 ml-2" />
              שלח למייל
            </Button>
          </div>
        </>
      )}

      <Dialog open={isMeetingFormOpen} onOpenChange={(open) => !open && handleCloseForm()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedMeeting ? 'עריכת מפגש' : 'הוסף מפגש חדש'}</DialogTitle>
          </DialogHeader>
          <MeetingForm 
            orderId={order.id}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            isSubmitting={isCreating}
            initialData={selectedMeeting}
            use45MinuteUnits={use45MinuteUnits}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
