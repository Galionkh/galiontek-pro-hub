
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SystemLogoProps {
  systemName: string;
  logoUrl: string;
  loading: boolean;
}

export const SystemLogo = ({ systemName, logoUrl, loading }: SystemLogoProps) => {
  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-primary-foreground/20 animate-pulse" />
    );
  }

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={logoUrl} alt="System Logo" />
      <AvatarFallback>{systemName.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};
