
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface FontSizeControlProps {
  fontSize: number;
  onFontSizeChange: (value: number[]) => void;
}

export function FontSizeControl({ fontSize, onFontSizeChange }: FontSizeControlProps) {
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
          value={[fontSize]}
          onValueChange={onFontSizeChange}
          className="flex-1"
        />
        <span className="text-sm">גדול</span>
      </div>
    </div>
  );
}
