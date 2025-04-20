
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface FontSizeControlProps {
  currentSize: number;
  onSizeChange: (size: number) => void;
}

export function FontSizeControl({ currentSize, onSizeChange }: FontSizeControlProps) {
  const { toast } = useToast();

  const getFontSizeName = (size: number) => {
    const names: Record<number, string> = {
      1: 'קטן',
      2: 'בינוני',
      3: 'גדול'
    };
    return names[size] || 'בינוני';
  };

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    onSizeChange(newSize);
    
    toast({
      title: "גודל הטקסט עודכן",
      description: `גודל הטקסט השתנה ל${getFontSizeName(newSize)}`,
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="font-size">גודל טקסט</Label>
      <div className="flex items-center gap-4">
        <span className="text-sm">קטן</span>
        <Slider
          id="font-size"
          min={1}
          max={3}
          step={1}
          value={[currentSize]}
          onValueChange={handleFontSizeChange}
          className="flex-1"
        />
        <span className="text-sm">גדול</span>
      </div>
    </div>
  );
}
