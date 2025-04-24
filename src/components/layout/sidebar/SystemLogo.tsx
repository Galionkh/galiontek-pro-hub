
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SystemLogoProps {
  systemName: string;
  logoUrl: string;
  loading: boolean;
}

export const SystemLogo = ({ systemName, logoUrl, loading }: SystemLogoProps) => {
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Reset image error when logo URL changes or on component mount
  useEffect(() => {
    if (logoUrl) {
      setImageError(false);
    }
  }, [logoUrl]);

  // Retry loading image if it fails (up to 2 times)
  useEffect(() => {
    if (imageError && retryCount < 2 && logoUrl) {
      const timer = setTimeout(() => {
        console.log(`Retrying logo load, attempt ${retryCount + 1}`);
        setImageError(false);
        setRetryCount(prev => prev + 1);
      }, 2000); // Wait 2 seconds before retrying
      
      return () => clearTimeout(timer);
    }
  }, [imageError, retryCount, logoUrl]);

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

  // Get first letter of system name or use "G" as fallback
  const fallbackLetter = systemName && systemName.length > 0 
    ? systemName.charAt(0).toUpperCase() 
    : "G";

  return (
    <Avatar className="h-8 w-8">
      {logoUrl && !imageError ? (
        <AvatarImage 
          src={`${logoUrl}${logoUrl.includes('?') ? '&' : '?'}t=${Date.now()}`}
          alt="System Logo" 
          onError={handleImageError}
        />
      ) : (
        <AvatarFallback>{fallbackLetter}</AvatarFallback>
      )}
    </Avatar>
  );
};
