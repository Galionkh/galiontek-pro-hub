
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DatePickerFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
}

export function DatePickerField({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  error,
}: DatePickerFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        name={name}
        type="date"
        value={value}
        onChange={onChange}
        required={required}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
