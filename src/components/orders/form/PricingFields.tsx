
import { HoursField } from "./HoursField";
import { HourlyRateField } from "./HourlyRateField";
import { TotalAmountField } from "./TotalAmountField";

interface PricingFieldsProps {
  hours: string | number;
  hourlyRate: string | number;
  totalAmount: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PricingFields({ hours, hourlyRate, totalAmount, onChange }: PricingFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <HoursField hours={hours} onChange={onChange} />
      <HourlyRateField hourlyRate={hourlyRate} onChange={onChange} />
      <TotalAmountField totalAmount={totalAmount} onChange={onChange} />
    </div>
  );
}
