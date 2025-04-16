
import React, { useRef } from "react";

interface FileImportInputProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileImportInput: React.FC<FileImportInputProps> = ({ onFileChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <input 
      type="file" 
      ref={fileInputRef}
      onChange={onFileChange} 
      accept=".xlsx,.xls" 
      className="hidden" 
      id="excel-import" 
    />
  );
};

export const useFileInput = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return { fileInputRef, triggerFileInput };
};
