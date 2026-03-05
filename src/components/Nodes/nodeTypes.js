import AuthNode from "./AuthNode";
import DatabaseNode from "./DatabaseNode";
import StorageNode from "./StorageNode";
import FunctionsNode from "./FunctionsNode";
import RealtimeNode from "./RealtimeNode";
import MessagingNode from "./MessagingNode";

export const nodeTypes = {
  auth: AuthNode,
  database: DatabaseNode,
  storage: StorageNode,
  functions: FunctionsNode,
  realtime: RealtimeNode,
  messaging: MessagingNode,
};
