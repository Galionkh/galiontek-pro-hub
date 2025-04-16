
import { FormField } from "./FormField";

interface PricingFieldsProps {
  hours: string | number;
  hourlyRate: string | number;
  totalAmount: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PricingFields({ hours, hourlyRate, totalAmount, onChange }: PricingFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      />

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
      />

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
    </div>
  );
}
