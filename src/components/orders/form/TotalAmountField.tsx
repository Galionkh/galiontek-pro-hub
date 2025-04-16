
import React from "react";
import { FormField } from "./FormField";

interface TotalAmountFieldProps {
  totalAmount: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TotalAmountField({ totalAmount, onChange }: TotalAmountFieldProps) {
  return (
    <FormField
      id="total_amount"
      name="total_amount"
      label="סכום כולל (₪)"
      type="number"
      value={totalAmount}
      onChange={onChange}
      readOnly={true}
      className="bg-gray-50 ltr-input"
      dir="ltr"
    />
  );
}
