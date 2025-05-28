"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserForm } from '@/components/forms/user-form';
import { FileUpload } from '@/components/forms/file-upload';

export function TabNavigation() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <Tabs defaultValue="users" className="space-y-6" onValueChange={setActiveTab}>
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
        <TabsTrigger value="users" className="data-[state=active]:font-semibold">
          User Management
        </TabsTrigger>
        <TabsTrigger value="files" className="data-[state=active]:font-semibold">
          File Management
        </TabsTrigger>
      </TabsList>
      <TabsContent value="users" className="space-y-8">
        <UserForm />
      </TabsContent>
      <TabsContent value="files" className="space-y-8">
        <FileUpload />
      </TabsContent>
    </Tabs>
  );
}