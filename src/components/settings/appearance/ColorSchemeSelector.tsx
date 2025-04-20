
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
    onSchemeChange(scheme);
    toast({
      title: "ערכת צבעים עודכנה",
      description: `ערכת הצבעים השתנתה ל${getColorSchemeName(scheme)}`,
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="color-scheme">ערכת צבעים</Label>
      <div className="flex flex-row gap-2 mt-2">
        {['purple', 'blue', 'green', 'orange'].map((scheme) => (
          <button 
            key={scheme}
            onClick={() => handleColorSchemeChange(scheme)}
            className={`w-16 h-10 rounded-md bg-${scheme}-500 text-white ${currentScheme === scheme ? 'ring-2 ring-primary' : ''}`}
          >
            {getColorSchemeName(scheme)}
          </button>
        ))}
      </div>
    </div>
  );
}
