
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ThemeToggle } from "./appearance/ThemeToggle";
import { ColorSchemeSelector } from "./appearance/ColorSchemeSelector";
import { FontSizeControl } from "./appearance/FontSizeControl";
import { SystemIdentity } from "./appearance/SystemIdentity";
import { useAppearance } from "@/hooks/useAppearance";

export function AppearanceTab() {
  const {
    darkMode,
    colorScheme,
    customColor,
    fontSize,
    systemName,
    logoUrl,
    error,
    handleColorSchemeChange,
    handleCustomColorChange,
    handleFontSizeChange,
    handleSystemNameChange,
    handleLogoChange
  } = useAppearance();

  return (
    <Card>
      <CardHeader>
        <CardTitle>ערכת צבעים</CardTitle>
        <CardDescription>התאם את התצוגה לפי העדפותיך</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <SystemIdentity
          systemName={systemName}
          logoUrl={logoUrl}
          onSystemNameChange={handleSystemNameChange}
          onLogoChange={handleLogoChange}
        />
        
        <ThemeToggle 
          initialDarkMode={darkMode}
          onThemeChange={(isDark) => {
            // Re-apply color scheme when theme changes for custom colors
            if (colorScheme === 'custom' && customColor) {
              // The hook will handle re-applying the color scheme
            }
          }}
        />
        
        <ColorSchemeSelector
          currentScheme={colorScheme}
          onSchemeChange={handleColorSchemeChange}
          customColor={customColor}
          onCustomColorChange={handleCustomColorChange}
        />
        
        <FontSizeControl
          currentSize={fontSize}
          onSizeChange={handleFontSizeChange}
        />
      </CardContent>
    </Card>
  );
}
