
import React from "react";
import { FileDown, Mail, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { exportToPDF, shareViaWhatsApp, sendEmail } from "@/features/meetings/exports";
import type { Meeting } from "@/features/meetings/types";
import type { Order } from "@/features/clients/types";

interface MeetingsActionsProps {
  order: Order;
  meetings: Meeting[];
  use45MinuteUnits: boolean;
}

export const MeetingsActions: React.FC<MeetingsActionsProps> = ({
  order,
  meetings,
  use45MinuteUnits,
}) => {
  const { toast } = useToast();

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

  if (meetings.length === 0) {
    return null;
  }

  return (
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
  );
};
