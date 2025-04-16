
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface ClientFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  title: string;
  submitLabel: string;
  isLoading: boolean;
  children: React.ReactNode;
  triggerButton?: React.ReactNode;
}

export function ClientFormDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  title,
  submitLabel,
  isLoading,
  children,
  triggerButton
}: ClientFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {children}
        </div>
        <DialogFooter>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "שומר..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
