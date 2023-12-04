import { Client, Databases, Account, Storage } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("656de9d4dfb65b80bc49"); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client)
export { ID } from "appwrite"
