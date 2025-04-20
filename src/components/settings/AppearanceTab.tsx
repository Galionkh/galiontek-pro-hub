
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SystemSettingsSection } from "./SystemSettingsSection";
import { ThemeToggle } from "./appearance/ThemeToggle";
import { ColorSchemeSelector } from "./appearance/ColorSchemeSelector";
import { FontSizeControl } from "./appearance/FontSizeControl";
import { useAppearance } from "./appearance/useAppearance";

export function AppearanceTab() {
  const {
    darkMode,
    colorScheme,
    fontSize,
    toggleTheme,
    handleColorSchemeChange,
    handleFontSizeChange
  } = useAppearance();

  return (
    <div className="space-y-6">
      <SystemSettingsSection />
      
      <Card>
        <CardHeader>
          <CardTitle>ערכת צבעים</CardTitle>
          <CardDescription>התאם את התצוגה לפי העדפותיך</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
          <ColorSchemeSelector 
            colorScheme={colorScheme} 
            onColorSchemeChange={handleColorSchemeChange} 
          />
          <FontSizeControl 
            fontSize={fontSize} 
            onFontSizeChange={handleFontSizeChange} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
