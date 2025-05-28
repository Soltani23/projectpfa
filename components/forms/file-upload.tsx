"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { File, Upload, Loader2, FileUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { uploadFile } from '@/lib/db';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  file: z.any().refine((file) => file?.length === 1, "Please select a file"),
});

export function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
    },
  });

  function simulateProgress() {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    return interval;
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsUploading(true);
    const file = data.file[0];
    setFileName(file.name);
    
    // Simulate upload with progress
    const progressInterval = simulateProgress();

    try {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await uploadFile(file);
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
      
      // Reset form
      form.reset();
      setFileName("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your file.",
      });
    } finally {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 mb-6">
          <FileUp className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold tracking-tight">File Management</h2>
            <p className="text-sm text-muted-foreground">
              Upload or remove files from the system
            </p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Upload File</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="file"
                          {...field}
                          onChange={(e) => {
                            onChange(e.target.files);
                            if (e.target.files?.[0]) {
                              setFileName(e.target.files[0].name);
                            }
                          }}
                          className={value ? "file:text-primary" : ""}
                          disabled={isUploading}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Select a file to upload to the system.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading: {fileName}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} max={100} className="h-2" />
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setFileName("");
                }}
                disabled={isUploading}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isUploading || !form.formState.isValid}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}