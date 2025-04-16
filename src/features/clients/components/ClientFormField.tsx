
import React from "react";
import { Input } from "@/components/ui/input";

interface ClientFormFieldProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function ClientFormField({ placeholder, value, onChange, className = "" }: ClientFormFieldProps) {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
}
