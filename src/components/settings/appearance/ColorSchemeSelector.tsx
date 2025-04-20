
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

interface ColorSchemeSelectorProps {
  currentScheme: string;
  onSchemeChange: (scheme: string) => void;
}

export function ColorSchemeSelector({ currentScheme, onSchemeChange }: ColorSchemeSelectorProps) {
  const { toast } = useToast();

  const getColorSchemeName = (scheme: string) => {
    const names: Record<string, string> = {
      'purple': 'סגול',
      'blue': 'כחול',
      'green': 'ירוק',
      'orange': 'כתום'
    };
    return names[scheme] || scheme;
  };

  const handleColorSchemeChange = (scheme: string) => {
    try {
      onSchemeChange(scheme);
      toast({
        title: "ערכת צבעים עודכנה",
        description: `ערכת הצבעים השתנתה ל${getColorSchemeName(scheme)}`,
      });
    } catch (error) {
      console.error("Error updating color scheme:", error);
      toast({
        variant: "destructive",
        title: "שגיאה בעדכון ערכת הצבעים",
        description: "נתקלנו בבעיה בעת עדכון ערכת הצבעים. יתכן והחיבור לשרת נכשל.",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="color-scheme">ערכת צבעים</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {['purple', 'blue', 'green', 'orange'].map((scheme) => (
          <button 
            key={scheme}
            onClick={() => handleColorSchemeChange(scheme)}
            className={`w-16 h-10 rounded-md ${scheme === 'purple' ? 'bg-purple-500' : scheme === 'blue' ? 'bg-blue-500' : scheme === 'green' ? 'bg-green-500' : 'bg-orange-500'} text-white text-xs ${currentScheme === scheme ? 'ring-2 ring-primary' : ''}`}
          >
            {getColorSchemeName(scheme)}
          </button>
        ))}
      </div>
    </div>
  );
}
