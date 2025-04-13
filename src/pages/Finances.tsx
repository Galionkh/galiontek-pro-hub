
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Download, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Finances() {
  const [open, setOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically save this data to a database
    console.log({
      type: transactionType,
      amount: Number(amount),
      description,
      date,
    });
    
    // Show success message
    toast({
      title: "רישום כספי חדש נוצר בהצלחה",
      description: `${transactionType === "income" ? "הכנסה" : "הוצאה"}: ${amount} ₪`,
    });
    
    // Reset form and close dialog
    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">כספים</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>יצוא דוח PDF</span>
          </Button>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>רישום חדש</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-right">רישום כספי חדש</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    type="button"
                    variant={transactionType === "income" ? "default" : "outline"}
                    onClick={() => setTransactionType("income")}
                    className="w-full"
                  >
                    הכנסה
                  </Button>
                  <Button 
                    type="button"
                    variant={transactionType === "expense" ? "default" : "outline"}
                    onClick={() => setTransactionType("expense")}
                    className="w-full"
                  >
                    הוצאה
                  </Button>
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="amount" className="text-right">סכום (₪)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    className="text-right"
                  />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="description" className="text-right">תיאור</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="תיאור קצר"
                    required
                    className="text-right"
                  />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="date" className="text-right">תאריך</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                
                <DialogFooter className="mt-4">
                  <Button type="submit" className="flex items-center gap-2 w-full">
                    <Check className="h-4 w-4" />
                    שמור רישום
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="grid w-full md:w-auto grid-cols-4 md:grid-cols-4">
          <TabsTrigger value="all">הכל</TabsTrigger>
          <TabsTrigger value="income">הכנסות</TabsTrigger>
          <TabsTrigger value="expenses">הוצאות</TabsTrigger>
          <TabsTrigger value="invoices">חשבוניות</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              <h2 className="text-xl font-semibold mb-2">כאן יוצגו הנתונים הכספיים</h2>
              <p>רשום הכנסה או הוצאה חדשה כדי להתחיל</p>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="income" className="mt-4">
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              <h2 className="text-xl font-semibold mb-2">הכנסות</h2>
              <p>כאן יוצגו ההכנסות שלך</p>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="expenses" className="mt-4">
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              <h2 className="text-xl font-semibold mb-2">הוצאות</h2>
              <p>כאן יוצגו ההוצאות שלך</p>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="invoices" className="mt-4">
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              <h2 className="text-xl font-semibold mb-2">חשבוניות</h2>
              <p>כאן יוצגו החשבוניות שהנפקת</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
