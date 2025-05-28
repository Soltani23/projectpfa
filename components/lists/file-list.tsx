"use client";

import { useEffect, useState } from 'react';
import { getFiles, deleteFile } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Files, SearchIcon, RefreshCw, Loader2, FileText, Image, FileArchive, FileSpreadsheet, FileX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';

interface AppFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export function FileList() {
  const [files, setFiles] = useState<AppFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

 const fetchFiles = async () => {
  setIsLoading(true);
  try {
    const data = await getFiles();
    // Mapping explicite pour garantir le bon format :
    const files: AppFile[] = data.map((f: any) => ({
      id: f.id,
      name: f.name,
      size: f.size,
      type: f.type,
      uploadedAt: String(f.uploadedAt),
    }));
    setFiles(files);
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Failed to load files",
      description: "There was an error loading the file list.",
    });
  } finally {
    setIsLoading(false);
  }
};
  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDeleteFile = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteFile(id);
      setFiles(files.filter(file => file.id !== id));
      toast({
        title: "File deleted",
        description: "The file has been removed successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was an error deleting the file.",
      });
    } finally {
      setFileToDelete(null);
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-10 w-10 text-blue-500" />;
    if (type.startsWith('application/pdf')) return <FileText className="h-10 w-10 text-red-500" />;
    if (type.startsWith('application/zip') || type.startsWith('application/x-rar')) 
      return <FileArchive className="h-10 w-10 text-purple-500" />;
    if (type.startsWith('application/vnd.ms-excel') || type.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml')) 
      return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
    return <FileText className="h-10 w-10 text-gray-500" />;
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Files className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>File List</CardTitle>
              <CardDescription>Manage uploaded files</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button size="icon" variant="outline" onClick={fetchFiles} title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredFiles.length > 0 ? (
          <div className="space-y-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center p-4 bg-card border border-border rounded-lg shadow-sm transition-all hover:shadow-md"
              >
                {getFileIcon(file.type)}
                <div className="ml-4 flex-1 min-w-0">
                  <h3 className="font-medium text-base line-clamp-1">{file.name}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                    <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                    <div className="hidden sm:block text-muted-foreground">•</div>
                    <p className="text-sm text-muted-foreground">
                      Uploaded {formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <AlertDialog open={fileToDelete === file.id} onOpenChange={(open) => !open && setFileToDelete(null)}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setFileToDelete(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete File</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{file.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteFile(file.id)}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FileX className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No files found</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "No files match your search criteria."
                : "Start by uploading files in the file management section."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}