
import { FormField } from "@/components/orders/form/FormField";

interface IndividualClientFormProps {
  formData: {
    name: string;
    contact: string;
    email: string;
    notes: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function IndividualClientForm({ formData, onChange }: IndividualClientFormProps) {
  return (
    <div className="space-y-4">
      <FormField
        id="name"
        name="name"
        label="שם פרטי ומשפחה"
        value={formData.name}
        onChange={onChange}
        required
      />
      <FormField
        id="contact"
        name="contact"
        label="טלפון"
        value={formData.contact}
        onChange={onChange}
      />
      <FormField
        id="email"
        name="email"
        label="דוא״ל"
        type="email"
        value={formData.email}
        onChange={onChange}
      />
      <FormField
        id="notes"
        name="notes"
        label="הערות"
        value={formData.notes}
        onChange={onChange}
      />
    </div>
  );
}
