
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <DialogContent className="max-w-2xl h-[85vh] flex flex-col" dir="rtl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow pl-4">
          <div className="space-y-4 pl-2">
            {children}
          </div>
        </ScrollArea>
        <DialogFooter className="sm:justify-start">
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "שומר..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
