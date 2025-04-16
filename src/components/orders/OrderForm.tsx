
import { Button } from "@/components/ui/button";
import { FormField } from "./form/FormField";
import { ClientSelector } from "./form/ClientSelector";
import { StatusSelector } from "./form/StatusSelector";
import { PricingFields } from "./form/PricingFields";
import { DatePickerField } from "./form/DatePickerField";
import { TextareaField } from "./form/TextareaField";
import { useOrderForm } from "./hooks/useOrderForm";

export interface OrderFormProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  isEdit?: boolean;
}

export function OrderForm({ onClose, onSubmit, initialData, isEdit = false }: OrderFormProps) {
  const { 
    formData, 
    clients, 
    isLoading, 
    validationErrors,
    handleChange, 
    handleSelectChange,
    handleSubmit 
  } = useOrderForm({ onClose, onSubmit, initialData });

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <FormField
        id="title"
        name="title"
        label="כותרת הטופס"
        value={formData.title}
        onChange={handleChange}
        required={true}
        error={validationErrors.title}
      />

      <ClientSelector 
        clientId={formData.client_id} 
        clients={clients} 
        onClientSelect={(value) => handleSelectChange("client_id", value)}
        isRequired={true}
        error={validationErrors.client_id}
      />

      <DatePickerField 
        id="date"
        name="date"
        label="תאריך"
        value={formData.date}
        onChange={handleChange}
      />

      <FormField
        id="service_topic"
        name="service_topic"
        label="נושא השירות / שם התוכנית"
        value={formData.service_topic || ""}
        onChange={handleChange}
      />

      <PricingFields 
        hours={formData.hours} 
        hourlyRate={formData.hourly_rate} 
        totalAmount={formData.total_amount} 
        onChange={handleChange}
      />

      <FormField
        id="payment_terms"
        name="payment_terms"
        label="תנאי תשלום"
        value={formData.payment_terms || ""}
        onChange={handleChange}
      />

      <StatusSelector 
        status={formData.status} 
        onStatusChange={(value) => handleSelectChange("status", value)}
      />

      <TextareaField
        id="description"
        name="description"
        label="תיאור"
        value={formData.description || ""}
        onChange={handleChange}
      />

      <TextareaField
        id="notes"
        name="notes"
        label="הערות"
        value={formData.notes || ""}
        onChange={handleChange}
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="ml-2">
          ביטול
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "שומר..." : isEdit ? "עדכן הזמנה" : "צור הזמנה"}
        </Button>
      </div>
    </form>
  );
}
