"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserList } from '@/components/lists/user-list';
import { FileList } from '@/components/lists/file-list';

export function ListNavigation() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <Tabs defaultValue="users" className="space-y-6" onValueChange={setActiveTab}>
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
        <TabsTrigger value="users" className="data-[state=active]:font-semibold">
          User List
        </TabsTrigger>
        <TabsTrigger value="files" className="data-[state=active]:font-semibold">
          File List
        </TabsTrigger>
      </TabsList>
      <TabsContent value="users" className="space-y-8">
        <UserList />
      </TabsContent>
      <TabsContent value="files" className="space-y-8">
        <FileList />
      </TabsContent>
    </Tabs>
  );
}