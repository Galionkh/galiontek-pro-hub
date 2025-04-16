
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  min?: string | number;
  step?: string;
  className?: string;
  dir?: "rtl" | "ltr";
  error?: string;
}

export function FormField({
  id,
  name,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  readOnly = false,
  min,
  step,
  className = "",
  dir,
  error,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        readOnly={readOnly}
        min={min}
        step={step}
        className={`${className} ${error ? "border-red-500" : ""}`}
        dir={dir}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
