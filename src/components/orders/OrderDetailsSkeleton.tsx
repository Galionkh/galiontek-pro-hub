
import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const OrderDetailsSkeleton: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="details" disabled>פרטי הזמנה</TabsTrigger>
          <TabsTrigger value="meetings" disabled>מפגשים</TabsTrigger>
        </TabsList>
        
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Skeleton className="h-6 w-36 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-48" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-48" />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <Skeleton className="h-6 w-36 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-40" />
                </div>
              </div>
            </div>

            <Separator />
            
            <div>
              <Skeleton className="h-6 w-36 mb-4" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6 mt-2" />
              <Skeleton className="h-5 w-4/6 mt-2" />
            </div>
          </div>
        </Card>
      </Tabs>
    </div>
  );
};
