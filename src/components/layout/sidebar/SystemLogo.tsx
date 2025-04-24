
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SystemLogoProps {
  systemName: string;
  logoUrl: string;
  loading: boolean;
}

export const SystemLogo = ({ systemName, logoUrl, loading }: SystemLogoProps) => {
  const [imageError, setImageError] = useState(false);

  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-primary-foreground/20 animate-pulse" />
    );
  }

  // Handle empty or invalid logo URL
  const handleImageError = () => {
    setImageError(true);
    console.warn("Failed to load logo image");
  };

  return (
    <Avatar className="h-8 w-8">
      {logoUrl && !imageError ? (
        <AvatarImage 
          src={logoUrl} 
          alt="System Logo" 
          onError={handleImageError}
        />
      ) : (
        <AvatarFallback>{systemName && systemName.length > 0 ? systemName.charAt(0).toUpperCase() : "G"}</AvatarFallback>
      )}
    </Avatar>
  );
};
