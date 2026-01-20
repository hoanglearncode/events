"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminBlogManagement from "@/components/features/adminBlog/AdminBlogManagement";
import { Package, FolderTree } from "lucide-react";

export default function AdminManagement() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsContent value="products" className="space-y-6">
            <AdminBlogManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
