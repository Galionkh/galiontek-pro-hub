
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Image, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LogoUploaderProps {
  logoUrl: string;
  systemName: string;
  isUploadingLogo: boolean;
  isRemovingLogo: boolean;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoRemove: () => void;
}

export function LogoUploader({
  logoUrl,
  systemName,
  isUploadingLogo,
  isRemovingLogo,
  onLogoUpload,
  onLogoRemove
}: LogoUploaderProps) {
  return (
    <div className="space-y-2">
      <Label>לוגו המערכת</Label>
      <div className="flex items-center gap-4">
        {logoUrl && (
          <Avatar className="h-16 w-16">
            <AvatarImage src={`${logoUrl}`} alt="System Logo" />
            <AvatarFallback>{systemName.charAt(0) || "G"}</AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1 space-y-2">
          <Input
            type="file"
            accept="image/*"
            onChange={onLogoUpload}
            className="hidden"
            id="logo-upload"
          />
          <div className="flex flex-wrap gap-2">
            <Label
              htmlFor="logo-upload"
              className="flex items-center gap-2 cursor-pointer border rounded-md p-2 hover:bg-accent"
            >
              <Image className="h-4 w-4" />
              {isUploadingLogo ? "מעלה..." : "העלה לוגו חדש"}
            </Label>
            
            {logoUrl && (
              <Button 
                variant="outline" 
                type="button" 
                size="sm"
                onClick={onLogoRemove}
                disabled={isRemovingLogo}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {isRemovingLogo ? "מוחק..." : "מחק לוגו"}
              </Button>
            )}
          </div>
          
          {!logoUrl && (
            <p className="text-sm text-muted-foreground mt-2">
              טרם הועלה לוגו למערכת
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
