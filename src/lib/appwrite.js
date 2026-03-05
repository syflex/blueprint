import { Client, Account, Databases } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || "placeholder";

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
