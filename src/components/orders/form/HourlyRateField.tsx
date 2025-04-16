
import React from "react";
import { FormField } from "./FormField";

interface HourlyRateFieldProps {
  hourlyRate: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function HourlyRateField({ hourlyRate, onChange }: HourlyRateFieldProps) {
  return (
    <FormField
      id="hourly_rate"
      name="hourly_rate"
      label="תעריף לשעה (₪)"
      type="number"
      min="0"
      step="0.01"
      value={hourlyRate}
      onChange={onChange}
      className="ltr-input"
      dir="ltr"
      required={true}
    />
  );
}
