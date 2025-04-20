
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ColorSchemeSelectorProps {
  colorScheme: string;
  onColorSchemeChange: (scheme: string) => void;
}

export function ColorSchemeSelector({ colorScheme, onColorSchemeChange }: ColorSchemeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="color-scheme">ערכת צבעים</Label>
      <div className="flex flex-row gap-2 mt-2">
        <button 
          onClick={() => onColorSchemeChange('purple')}
          className={`w-16 h-10 rounded-md bg-purple-500 text-white ${colorScheme === 'purple' ? 'ring-2 ring-primary' : ''}`}
        >
          סגול
        </button>
        <button 
          onClick={() => onColorSchemeChange('blue')}
          className={`w-16 h-10 rounded-md bg-blue-500 text-white ${colorScheme === 'blue' ? 'ring-2 ring-primary' : ''}`}
        >
          כחול
        </button>
        <button 
          onClick={() => onColorSchemeChange('green')}
          className={`w-16 h-10 rounded-md bg-green-500 text-white ${colorScheme === 'green' ? 'ring-2 ring-primary' : ''}`}
        >
          ירוק
        </button>
        <button 
          onClick={() => onColorSchemeChange('orange')}
          className={`w-16 h-10 rounded-md bg-orange-500 text-white ${colorScheme === 'orange' ? 'ring-2 ring-primary' : ''}`}
        >
          כתום
        </button>
      </div>
    </div>
  );
}
