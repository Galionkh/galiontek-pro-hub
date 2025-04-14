
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        navigate("/");
      } else {
        navigate("/login");
      }
    }
  }, [isLoading, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">טוען...</h1>
        <p className="text-xl text-gray-600">אנא המתן</p>
      </div>
    </div>
  );
};

export default Index;
