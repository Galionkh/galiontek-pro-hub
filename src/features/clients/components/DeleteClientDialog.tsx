
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { Client } from "../types";

interface DeleteClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientToDelete: Client | null;
  hasOrders: boolean;
  onConfirmDelete: (deleteOrders: boolean) => Promise<void>;
  onArchive: (client: Client) => Promise<void>;
}

export function DeleteClientDialog({
  isOpen,
  onOpenChange,
  clientToDelete,
  hasOrders,
  onConfirmDelete,
  onArchive,
}: DeleteClientDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>מחיקת לקוח</AlertDialogTitle>
          <AlertDialogDescription>
            {hasOrders
              ? "לקוח זה מקושר להזמנות. מה ברצונך לעשות?"
              : "האם אתה בטוח שברצונך למחוק לקוח זה? פעולה זו אינה הפיכה."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <AlertDialogCancel>ביטול</AlertDialogCancel>
          {hasOrders ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => clientToDelete && onArchive(clientToDelete)}
                className="flex items-center gap-2"
              >
                <Archive className="h-4 w-4" />
                העבר לארכיון
              </Button>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => onConfirmDelete(true)}
              >
                מחק לקוח והזמנות
              </AlertDialogAction>
            </>
          ) : (
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => onConfirmDelete(false)}
            >
              מחק לקוח
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
