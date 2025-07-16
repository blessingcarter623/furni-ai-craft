
export interface FlowiseMessage {
  role: string;
  content: string;
  name?: string;
}

export interface FlowiseTimeMetadata {
  start: number;
  end: number;
  delta: number;
}

export interface FlowiseUsageMetadata {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  input_token_details: {
    audio: number;
    cache_read: number;
  };
  output_token_details: {
    audio: number;
    reasoning: number;
  };
  tool_call_tokens: number;
}

export interface FlowiseTool {
  name: string;
  description: string;
  schema: {
    type: string;
    properties: Record<string, any>;
    additionalProperties: boolean;
  };
  toolNode: {
    label: string;
    name: string;
  };
}

export interface FlowiseAgentData {
  id: string;
  name: string;
  input: {
    messages?: FlowiseMessage[];
    question?: string;
    agentModel?: string;
    agentEnableMemory?: boolean;
    agentMemoryType?: string;
    agentReturnResponseAs?: string;
    agentModelConfig?: Record<string, any>;
    agentTools?: any[];
  };
  output: {
    content?: string;
    question?: string;
    timeMetadata?: FlowiseTimeMetadata;
    calledTools?: any[];
    usageMetadata?: FlowiseUsageMetadata;
    availableTools?: FlowiseTool[];
  };
  state: Record<string, any>;
  chatHistory?: FlowiseMessage[];
}

export interface FlowiseExecutionNode {
  nodeId: string;
  nodeLabel: string;
  data: FlowiseAgentData;
  previousNodeIds: string[];
  status: string;
}

export interface FlowiseApiResponse {
  text: string;
  question: string;
  chatId: string;
  chatMessageId: string;
  executionId: string;
  agentFlowExecutedData: FlowiseExecutionNode[];
  sessionId: string;
}

export interface FlowiseApiRequest {
  question: string;
  uploads?: Array<{
    data: string; // base64 encoded image
    type: string; // mime type
    name: string; // filename
  }>;
  chatId?: string;
  streaming?: boolean;
}
