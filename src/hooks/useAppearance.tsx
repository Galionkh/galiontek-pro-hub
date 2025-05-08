
import { useState } from "react";
import { useThemePreferences } from "./useThemePreferences";
import { useSystemPreferences } from "./useSystemPreferences";

export function useAppearance() {
  const {
    darkMode,
    colorScheme,
    customColor,
    fontSize,
    setDarkMode,
    handleColorSchemeChange,
    handleCustomColorChange,
    handleFontSizeChange
  } = useThemePreferences();

  const {
    systemName,
    logoUrl,
    error,
    handleSystemNameChange,
    handleLogoChange
  } = useSystemPreferences();

  // Combine hooks to provide a single interface
  return {
    darkMode,
    colorScheme,
    customColor,
    fontSize,
    systemName,
    logoUrl,
    error,
    setDarkMode,
    handleColorSchemeChange,
    handleCustomColorChange,
    handleFontSizeChange,
    handleSystemNameChange,
    handleLogoChange
  };
}
