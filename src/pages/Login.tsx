
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LogIn, AlertCircle, WifiOff, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check connection to Supabase
  const checkConnection = async () => {
    setIsCheckingConnection(true);
    try {
      // Simple ping to check connection
      const { error } = await supabase.from('clients').select('id').limit(1);
      if (error && (error.message.includes('Failed to fetch') || error.code === 'PGRST301')) {
        console.error("Connection error:", error);
        setConnectionError(true);
      } else {
        setConnectionError(false);
        setError(null); // Clear any previous errors if connection is restored
      }
    } catch (error) {
      console.error("Connection check error:", error);
      setConnectionError(true);
    } finally {
      setIsCheckingConnection(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Set up a periodic check
    const interval = setInterval(() => {
      checkConnection();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      if (connectionError) {
        toast({
          title: "שגיאת חיבור",
          description: "אין חיבור למסד הנתונים, אנא נסה שוב מאוחר יותר",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      toast({
        title: "התחברת בהצלחה",
        description: "ברוך הבא למערכת!",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "אירעה שגיאה בעת ההתחברות");
      toast({
        title: "שגיאת התחברות",
        description: error.message || "אירעה שגיאה בעת ההתחברות",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryConnection = () => {
    checkConnection();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">התחברות לפלטפורמה</CardTitle>
          <CardDescription className="text-center">
            הזן את פרטי הכניסה שלך כדי להתחבר למערכת
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {connectionError && (
            <Alert variant="destructive">
              <WifiOff className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>אין חיבור למסד הנתונים. בדוק את חיבור האינטרנט שלך או נסה שוב מאוחר יותר.</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleRetryConnection}
                  disabled={isCheckingConnection}
                  className="ml-2"
                >
                  {isCheckingConnection ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="h-4 w-4" />
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {error && !connectionError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: "נדרש אימייל",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "כתובת אימייל לא תקינה"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>אימייל</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                rules={{ required: "נדרשת סיסמה" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>סיסמה</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading || connectionError || isCheckingConnection}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                ) : (
                  <LogIn className="h-4 w-4 ml-2" />
                )}
                התחבר
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground mt-2">
            מערכת פרטית - הגישה מותרת רק למשתמשים מורשים
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
