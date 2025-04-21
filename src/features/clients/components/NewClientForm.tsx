
  const handleSubmit = async () => {
    if (!user) return;
    if (!clientType) {
      toast({
        title: "שגיאה",
        description: "יש לבחור סוג לקוח",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase.from("clients").insert({
        ...formData,
        user_id: user.id,
        client_type: clientType,
      });

      if (error) throw error;

      toast({ title: "הלקוח נוסף בהצלחה" });
      setFormData({
        name: "",
        contact: "",
        email: "",
        status: "active",
        notes: "",
        institution_number: "",
        institution_type: "",
        city: "",
        address: "",
        principal_name: "",
        principal_email: "",
        principal_phone: "", // Added for principal phone
        contact_phone: "",   // Added for contact phone
        business_field: "",
        phone: "",
      });
      setClientType("");
      setIsOpen(false);
      onClientAdded();
    } catch (error: any) {
      console.error("Error adding client:", error);
      toast({ 
        title: "שגיאה", 
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
