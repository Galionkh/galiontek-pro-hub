
import { hexToHSL, generateSecondaryColor } from "@/lib/colorUtils";

/**
 * Apply theme colors to the document
 * @param scheme - The color scheme name
 */
export const applyColorScheme = (scheme: string) => {
  // Remove any existing color scheme classes
  document.documentElement.classList.remove('theme-purple', 'theme-blue', 'theme-green', 'theme-orange', 'theme-custom');
  
  // Add new color scheme class
  document.documentElement.classList.add(`theme-${scheme}`);
  
  // Update CSS variables based on the color scheme
  let primary, secondary;
  switch(scheme) {
    case 'purple':
      primary = '262 30% 50%';
      secondary = '260 100% 97%';
      break;
    case 'blue':
      primary = '210 100% 50%';
      secondary = '210 100% 97%';
      break;
    case 'green':
      primary = '142 76% 36%';
      secondary = '142 76% 97%';
      break;
    case 'orange':
      primary = '27 96% 61%';
      secondary = '27 100% 97%';
      break;
    default:
      primary = '262 30% 50%';
      secondary = '260 100% 97%';
  }

  // Apply CSS variables for both light and dark mode
  const root = document.documentElement;
  root.style.setProperty('--primary', primary);
  root.style.setProperty('--secondary', secondary);
};

/**
 * Apply custom color to the document
 * @param hexColor - The hex color code
 * @param isDarkMode - Whether dark mode is active
 */
export const applyCustomColorScheme = (hexColor: string, isDarkMode: boolean) => {
  try {
    // Remove any existing color scheme classes
    document.documentElement.classList.remove('theme-purple', 'theme-blue', 'theme-green', 'theme-orange');
    document.documentElement.classList.add('theme-custom');
    
    // Convert HEX to HSL
    const primaryHsl = hexToHSL(hexColor);
    const secondaryHsl = generateSecondaryColor(primaryHsl, isDarkMode);
    
    // Apply CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary', primaryHsl);
    root.style.setProperty('--secondary', secondaryHsl);
    
    // Set sidebar colors derived from primary
    root.style.setProperty('--sidebar-background', primaryHsl);
    root.style.setProperty('--sidebar-accent', adjustLightness(primaryHsl, isDarkMode ? 1.2 : 0.8));
    root.style.setProperty('--sidebar-border', adjustLightness(primaryHsl, isDarkMode ? 0.8 : 0.9));
    
    console.log(`Applied custom color: ${hexColor}, HSL: ${primaryHsl}, secondary: ${secondaryHsl}`);
  } catch (error) {
    console.error("Error applying custom color:", error);
    // Fallback to default purple
    applyColorScheme('purple');
  }
};

/**
 * Adjust the lightness of an HSL color
 * @param hsl - HSL color string
 * @param factor - Factor to adjust lightness by
 * @returns - Adjusted HSL color string
 */
export const adjustLightness = (hsl: string, factor: number): string => {
  const parts = hsl.split(' ');
  if (parts.length < 3) return hsl;
  
  const h = parts[0];
  const s = parts[1];
  const l = parseInt(parts[2]);
  const newL = Math.min(100, Math.max(0, Math.round(l * factor)));
  
  return `${h} ${s} ${newL}%`;
};

/**
 * Get CSS class for font size
 * @param size - Font size number (1-3)
 * @returns - CSS class name
 */
export const getFontSizeClass = (size: number) => {
  const classes: Record<number, string> = {
    1: 'text-sm',
    2: 'text-base',
    3: 'text-lg'
  };
  return classes[size] || 'text-base';
};

/**
 * Apply font size to document
 * @param size - Font size number (1-3)
 */
export const applyFontSize = (size: number) => {
  document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
  document.documentElement.classList.add(getFontSizeClass(size));
  
  // Update font size on the body
  switch(size) {
    case 1:
      document.body.style.fontSize = '0.875rem'; // text-sm
      break;
    case 2:
      document.body.style.fontSize = '1rem'; // text-base
      break;
    case 3:
      document.body.style.fontSize = '1.125rem'; // text-lg
      break;
    default:
      document.body.style.fontSize = '1rem';
  }
};
