
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-6">העמוד שחיפשת לא נמצא</p>
      <Link to="/">
        <Button className="flex items-center gap-2">
          <span>חזרה לדף הבית</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
