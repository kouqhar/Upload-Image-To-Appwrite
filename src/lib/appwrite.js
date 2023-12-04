import { Client, Databases, Account, Storage } from "appwrite";
const { VITE_PROJECT_ID } = import.meta.env;
const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(`${VITE_PROJECT_ID}`); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client)
export { ID } from "appwrite"
