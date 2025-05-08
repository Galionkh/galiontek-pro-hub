
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { hexToHSL } from "@/lib/colorUtils";

interface ColorSchemeSelectorProps {
  currentScheme: string;
  onSchemeChange: (scheme: string) => void;
  customColor?: string;
  onCustomColorChange: (hex: string) => void;
}

export function ColorSchemeSelector({ 
  currentScheme, 
  onSchemeChange, 
  customColor, 
  onCustomColorChange 
}: ColorSchemeSelectorProps) {
  const { toast } = useToast();
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState(customColor || "#6E59A5");

  useEffect(() => {
    // Load recent colors from localStorage
    const savedColors = localStorage.getItem('recentColors');
    if (savedColors) {
      try {
        setRecentColors(JSON.parse(savedColors).slice(0, 5));
      } catch (e) {
        console.error("Error loading recent colors:", e);
      }
    }
  }, []);

  const getColorSchemeName = (scheme: string) => {
    const names: Record<string, string> = {
      'purple': 'סגול',
      'blue': 'כחול',
      'green': 'ירוק',
      'orange': 'כתום',
      'custom': 'מותאם אישית'
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

  const handleCustomColorChange = (hex: string) => {
    setColorInput(hex);
    onCustomColorChange(hex);
    
    // Save to recent colors
    const updatedRecentColors = [
      hex, 
      ...recentColors.filter(color => color !== hex)
    ].slice(0, 5);
    
    setRecentColors(updatedRecentColors);
    localStorage.setItem('recentColors', JSON.stringify(updatedRecentColors));
    
    handleColorSchemeChange('custom');
  };

  const isValidHex = (hex: string) => {
    return /^#[0-9A-F]{6}$/i.test(hex);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColorInput(value);
    
    if (isValidHex(value)) {
      handleCustomColorChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="color-scheme">ערכת צבעים</Label>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="flex flex-wrap gap-2">
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
        
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 flex items-center gap-2 h-10"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: colorInput }}
                  />
                  <span>בחר צבע</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-color">צבע מותאם אישית</Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom-color"
                      type="color"
                      value={colorInput}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={colorInput}
                      onChange={handleHexInputChange}
                      placeholder="#000000"
                      className="flex-1"
                      maxLength={7}
                    />
                  </div>
                  
                  {recentColors.length > 0 && (
                    <div className="space-y-1 pt-2">
                      <Label className="text-xs">צבעים אחרונים</Label>
                      <div className="flex flex-wrap gap-1">
                        {recentColors.map((color, index) => (
                          <button
                            key={index}
                            onClick={() => handleCustomColorChange(color)}
                            className="w-6 h-6 rounded-md border border-border flex-shrink-0"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      {currentScheme === 'custom' && customColor && (
        <div className="mt-2 flex items-center gap-2 p-2 bg-muted rounded-md">
          <div 
            className="w-6 h-6 rounded-full border border-border" 
            style={{ backgroundColor: customColor }}
          />
          <span className="text-xs">צבע מותאם אישית בשימוש: {customColor}</span>
        </div>
      )}
    </div>
  );
}
