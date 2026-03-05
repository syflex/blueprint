import AuthNode from "./AuthNode";
import DatabaseNode from "./DatabaseNode";
import StorageNode from "./StorageNode";
import FunctionsNode from "./FunctionsNode";
import RealtimeNode from "./RealtimeNode";
import MessagingNode from "./MessagingNode";
import TeamsNode from "./TeamsNode";
import OAuthNode from "./OAuthNode";
import WebhooksNode from "./WebhooksNode";
import ClientAppNode from "./ClientAppNode";
import ExternalApiNode from "./ExternalApiNode";
import PaymentGatewayNode from "./PaymentGatewayNode";

export const nodeTypes = {
  auth: AuthNode,
  database: DatabaseNode,
  storage: StorageNode,
  functions: FunctionsNode,
  realtime: RealtimeNode,
  messaging: MessagingNode,
  teams: TeamsNode,
  oauth: OAuthNode,
  webhooks: WebhooksNode,
  clientApp: ClientAppNode,
  externalApi: ExternalApiNode,
  paymentGateway: PaymentGatewayNode,
};
