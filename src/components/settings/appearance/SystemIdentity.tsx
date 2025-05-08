
import { useSystemIdentity } from "@/hooks/useSystemIdentity";
import { SystemNameInput } from "./SystemNameInput";
import { LogoUploader } from "./LogoUploader";

interface SystemIdentityProps {
  systemName: string;
  logoUrl: string;
  onSystemNameChange: (name: string) => void;
  onLogoChange: (url: string) => void;
}

export function SystemIdentity({
  systemName,
  logoUrl,
  onSystemNameChange,
  onLogoChange,
}: SystemIdentityProps) {
  const {
    systemName: localSystemName,
    logoUrl: localLogoUrl,
    isSaving,
    isUploadingLogo,
    isRemovingLogo,
    handleSystemNameChange,
    saveSystemName,
    handleLogoUpload,
    removeLogo
  } = useSystemIdentity({
    initialSystemName: systemName,
    initialLogoUrl: logoUrl,
    onSystemNameChange,
    onLogoChange
  });

  return (
    <>
      <SystemNameInput 
        systemName={localSystemName}
        isSaving={isSaving}
        onSystemNameChange={handleSystemNameChange}
        onSave={saveSystemName}
      />

      <LogoUploader
        logoUrl={localLogoUrl}
        systemName={localSystemName}
        isUploadingLogo={isUploadingLogo}
        isRemovingLogo={isRemovingLogo}
        onLogoUpload={handleLogoUpload}
        onLogoRemove={removeLogo}
      />
    </>
  );
}
