
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isPending: boolean;
}

export function SubmitButton({ isPending }: SubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={isPending}>
      {isPending ? "יוצר משימה..." : "צור משימה"}
    </Button>
  );
}
