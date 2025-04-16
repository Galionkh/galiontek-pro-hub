
import React from "react";
import { FormField } from "./FormField";

interface HoursFieldProps {
  hours: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function HoursField({ hours, onChange }: HoursFieldProps) {
  return (
    <FormField
      id="hours"
      name="hours"
      label="מספר שעות"
      type="number"
      min="0"
      step="0.5"
      value={hours}
      onChange={onChange}
      className="ltr-input"
      dir="ltr"
      required={true}
    />
  );
}
