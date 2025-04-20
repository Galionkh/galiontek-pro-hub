
import { FormField } from "@/components/orders/form/FormField";

interface CompanyClientFormProps {
  formData: {
    name: string;
    contact: string;
    email: string;
    business_field: string;
    phone: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CompanyClientForm({ formData, onChange }: CompanyClientFormProps) {
  return (
    <div className="space-y-4" dir="rtl">
      <FormField
        id="name"
        name="name"
        label="שם החברה"
        value={formData.name}
        onChange={onChange}
        required
      />
      <FormField
        id="phone"
        name="phone"
        label="טלפון החברה"
        value={formData.phone}
        onChange={onChange}
        required
      />
      <FormField
        id="contact"
        name="contact"
        label="איש קשר"
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
        id="business_field"
        name="business_field"
        label="תחום עיסוק"
        value={formData.business_field}
        onChange={onChange}
      />
    </div>
  );
}
