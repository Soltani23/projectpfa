import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  ScanCommand,
  DeleteCommand
} from "@aws-sdk/lib-dynamodb";

// Types à ajouter :
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface File {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

const client = new DynamoDBClient({
  region: "local",
  endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
  credentials: {
    accessKeyId: "local",
    secretAccessKey: "local"
  }
});

const docClient = DynamoDBDocumentClient.from(client);

// User CRUD operations
export const createUser = async (user: Omit<User, 'id' | 'createdAt'>) => {
  const newUser = {
    id: Date.now().toString(),
    ...user,
    createdAt: new Date().toISOString(),
  };

  await docClient.send(
    new PutCommand({
      TableName: "Users",
      Item: newUser,
    })
  );

  return newUser;
};

export const getUsers = async (): Promise<User[]> => {
  const result = await docClient.send(
    new ScanCommand({
      TableName: "Users",
    })
  );

  return (result.Items as User[]) || [];
};

export const deleteUser = async (id: string) => {
  await docClient.send(
    new DeleteCommand({
      TableName: "Users",
      Key: { id },
    })
  );
  return { success: true };
};

// File CRUD operations
export const uploadFile = async (file: Omit<File, 'id' | 'uploadedAt'>) => {
  const newFile = {
    id: Date.now().toString(),
    ...file,
    uploadedAt: new Date().toISOString(),
  };

  await docClient.send(
    new PutCommand({
      TableName: "Files",
      Item: newFile,
    })
  );

  return newFile;
};

export const getFiles = async (): Promise<File[]> => {
  const result = await docClient.send(
    new ScanCommand({
      TableName: "Files",
    })
  );

  return (result.Items as File[]) || [];
};

export const deleteFile = async (id: string) => {
  await docClient.send(
    new DeleteCommand({
      TableName: "Files",
      Key: { id },
    })
  );
  return { success: true };
};