
import { FormField } from "@/components/orders/form/FormField";

interface EducationalClientFormProps {
  formData: {
    name: string;
    institution_number: string;
    institution_type: string;
    city: string;
    address: string;
    principal_name: string;
    principal_email: string;
    contact: string;
    email: string;
    phone: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EducationalClientForm({ formData, onChange }: EducationalClientFormProps) {
  return (
    <div className="space-y-4" dir="rtl">
      <h3 className="font-semibold mb-2">פרטי מוסד</h3>
      <FormField
        id="name"
        name="name"
        label="שם המוסד"
        value={formData.name}
        onChange={onChange}
        required
      />
      <FormField
        id="institution_number"
        name="institution_number"
        label="מספר מוסד"
        value={formData.institution_number}
        onChange={onChange}
      />
      <FormField
        id="phone"
        name="phone"
        label="טלפון המוסד"
        value={formData.phone}
        onChange={onChange}
        required
      />
      <FormField
        id="institution_type"
        name="institution_type"
        label="סוג מוסד"
        value={formData.institution_type}
        onChange={onChange}
        placeholder="יסודי / חטיבה / תיכון / חינוך מיוחד"
      />
      <FormField
        id="city"
        name="city"
        label="עיר / ישוב"
        value={formData.city}
        onChange={onChange}
      />
      <FormField
        id="address"
        name="address"
        label="כתובת"
        value={formData.address}
        onChange={onChange}
      />
      
      <h3 className="font-semibold mt-6 mb-2">פרטי מנהלת ראשית</h3>
      <FormField
        id="principal_name"
        name="principal_name"
        label="שם"
        value={formData.principal_name}
        onChange={onChange}
      />
      <FormField
        id="principal_email"
        name="principal_email"
        label="דוא״ל"
        type="email"
        value={formData.principal_email}
        onChange={onChange}
      />
      
      <h3 className="font-semibold mt-6 mb-2">פרטי איש קשר (ניהול/ניהולנית)</h3>
      <FormField
        id="contact"
        name="contact"
        label="שם"
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
    </div>
  );
}
