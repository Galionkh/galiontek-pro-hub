
import { Input } from "@/components/ui/input";
import React from "react";

interface ClientFormFieldProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

export function ClientFormField({ placeholder, value, onChange, type = "text" }: ClientFormFieldProps) {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={type}
    />
  );
}
