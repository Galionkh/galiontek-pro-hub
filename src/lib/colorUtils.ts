
/**
 * Convert a HEX color to HSL format
 * @param hex - HEX color code (e.g., #FF0000)
 * @returns HSL values as a string for CSS variables
 */
export const hexToHSL = (hex: string): string => {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  } else if (hex.length === 4) {
    r = parseInt(hex.substring(1, 2), 16) * 17;
    g = parseInt(hex.substring(2, 3), 16) * 17;
    b = parseInt(hex.substring(3, 4), 16) * 17;
  }

  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  // Calculate hue
  if (delta === 0) {
    h = 0;
  } else if (cmax === r) {
    h = ((g - b) / delta) % 6;
  } else if (cmax === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `${h} ${s}% ${l}%`;
};

/**
 * Generate a lighter or darker version of an HSL color
 * @param hsl - HSL color string (e.g., "210 100% 50%")
 * @param lightnessFactor - Factor to adjust lightness by
 * @returns Modified HSL color string
 */
export const adjustHSLLightness = (hsl: string, lightnessFactor: number): string => {
  const parts = hsl.split(' ');
  const h = parts[0]; 
  const s = parts[1];
  const l = parseInt(parts[2]); // Extract just the numeric part

  const newL = Math.max(0, Math.min(100, l * lightnessFactor));
  
  return `${h} ${s} ${newL}%`;
};

/**
 * Generate secondary color from primary color
 * @param primaryHsl - Primary color in HSL format
 * @param isDarkMode - Whether dark mode is active
 * @returns Secondary HSL color value
 */
export const generateSecondaryColor = (primaryHsl: string, isDarkMode: boolean): string => {
  const parts = primaryHsl.split(' ');
  const h = parts[0];
  const s = parts[1]; 
  
  if (isDarkMode) {
    // For dark mode, make a darker, less saturated secondary
    return `${h} ${parseInt(s) * 0.7}% 20%`;
  } else {
    // For light mode, make a very light version of the same hue
    return `${h} ${parseInt(s) * 0.8}% 97%`;
  }
};
