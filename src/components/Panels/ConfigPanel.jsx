import { useUiStore } from "../../store/uiStore";
import { useCanvasStore } from "../../store/canvasStore";
import { componentRegistry } from "../../registry/componentRegistry";
import AuthConfig from "./AuthConfig";
import DatabaseConfig from "./DatabaseConfig";
import StorageConfig from "./StorageConfig";
import FunctionsConfig from "./FunctionsConfig";
import RealtimeConfig from "./RealtimeConfig";
import MessagingConfig from "./MessagingConfig";
import TeamsConfig from "./TeamsConfig";
import OAuthConfig from "./OAuthConfig";
import WebhooksConfig from "./WebhooksConfig";
import ClientAppConfig from "./ClientAppConfig";
import ExternalApiConfig from "./ExternalApiConfig";
import PaymentGatewayConfig from "./PaymentGatewayConfig";

const configPanels = {
  auth: AuthConfig,
  database: DatabaseConfig,
  storage: StorageConfig,
  functions: FunctionsConfig,
  realtime: RealtimeConfig,
  messaging: MessagingConfig,
  teams: TeamsConfig,
  oauth: OAuthConfig,
  webhooks: WebhooksConfig,
  clientApp: ClientAppConfig,
  externalApi: ExternalApiConfig,
  paymentGateway: PaymentGatewayConfig,
};

export default function ConfigPanel() {
  const selectedNodeId = useUiStore((s) => s.selectedNodeId);
  const nodes = useCanvasStore((s) => s.nodes);
  const updateNodeConfig = useCanvasStore((s) => s.updateNodeConfig);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="icon-cursor-click mb-2 text-2xl text-[#D8D8DB]" />
        <p className="text-sm text-[#97979B]">
          Select a component on the canvas to configure it
        </p>
        <p className="mt-2 text-xs text-[#D8D8DB]">
          Or drag a component from the left sidebar
        </p>
      </div>
    );
  }

  const { componentType } = selectedNode.data;
  const def = componentRegistry[componentType];
  const ConfigComponent = configPanels[componentType];

  function handleConfigChange(updates) {
    updateNodeConfig(selectedNodeId, updates);
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-md"
          style={{ backgroundColor: `${def.color}15` }}
        >
          <span className={`${def.icon} text-sm`} style={{ color: def.color }} />
        </div>
        <div>
          <span className="text-sm font-medium text-[#2D2D31]">{def.label}</span>
          <span className="ml-2 text-[10px] text-[#97979B]">{selectedNode.id}</span>
        </div>
      </div>

      {ConfigComponent ? (
        <ConfigComponent
          config={selectedNode.data.config}
          onChange={handleConfigChange}
        />
      ) : (
        <p className="text-xs text-[#97979B]">No configuration available.</p>
      )}
    </div>
  );
}
