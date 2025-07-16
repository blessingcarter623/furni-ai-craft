
import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, Database, MessageSquare, Settings, Zap } from 'lucide-react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FlowiseApiResponse, FlowiseExecutionNode, FlowiseMessage } from '@/types/flowise';

interface FlowiseAnalysisResultsProps {
  response: FlowiseApiResponse;
}

export default function FlowiseAnalysisResults({ response }: FlowiseAnalysisResultsProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [showRawResponse, setShowRawResponse] = useState(false);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatDuration = (delta: number) => {
    return `${(delta / 1000).toFixed(2)}s`;
  };

  const renderMessages = (messages: FlowiseMessage[]) => {
    return (
      <div className="space-y-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-primary/10 border-l-4 border-primary'
                : message.role === 'assistant'
                ? 'bg-green-500/10 border-l-4 border-green-500'
                : 'bg-secondary/50 border-l-4 border-secondary'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {message.role}
              </Badge>
              {message.name && (
                <Badge variant="secondary" className="text-xs">
                  {message.name}
                </Badge>
              )}
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderNodeData = (node: FlowiseExecutionNode) => {
    const isExpanded = expandedNodes.has(node.nodeId);
    
    return (
      <GlassCard key={node.nodeId} className="mb-4">
        <GlassCardHeader>
          <div className="flex items-center justify-between">
            <GlassCardTitle className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleNode(node.nodeId)}
                className="p-1 h-auto"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
              <div className="flex items-center gap-2">
                {node.nodeLabel === 'Start' && <Zap className="w-5 h-5 text-green-400" />}
                {node.nodeLabel.includes('Agent') && <Database className="w-5 h-5 text-blue-400" />}
                <span>{node.nodeLabel}</span>
              </div>
              <Badge
                variant="outline"
                className={
                  node.status === 'FINISHED'
                    ? 'border-green-500/30 text-green-400 bg-green-500/10'
                    : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                }
              >
                {node.status}
              </Badge>
            </GlassCardTitle>
          </div>
        </GlassCardHeader>
        
        {isExpanded && (
          <GlassCardContent className="space-y-4">
            {/* Node Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Node ID:</span>
                <span className="ml-2 font-mono text-xs">{node.nodeId}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Previous Nodes:</span>
                <span className="ml-2">{node.previousNodeIds.length || 'None'}</span>
              </div>
            </div>

            {/* Input Data */}
            {node.data.input && Object.keys(node.data.input).length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 font-semibold mb-2">
                  <Settings className="w-4 h-4" />
                  Input Data
                </h4>
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(node.data.input, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Output Data */}
            {node.data.output && (
              <div>
                <h4 className="flex items-center gap-2 font-semibold mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Output
                </h4>
                <div className="space-y-3">
                  {node.data.output.content && (
                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                      <h5 className="text-sm font-medium mb-2">Content:</h5>
                      <p className="text-sm whitespace-pre-wrap">{node.data.output.content}</p>
                    </div>
                  )}
                  
                  {node.data.output.timeMetadata && (
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Duration: {formatDuration(node.data.output.timeMetadata.delta)}</span>
                      </div>
                      <span>Started: {formatTimestamp(node.data.output.timeMetadata.start)}</span>
                    </div>
                  )}

                  {node.data.output.usageMetadata && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-2 bg-secondary/30 rounded">
                        <div className="font-semibold">{node.data.output.usageMetadata.input_tokens}</div>
                        <div className="text-muted-foreground text-xs">Input Tokens</div>
                      </div>
                      <div className="text-center p-2 bg-secondary/30 rounded">
                        <div className="font-semibold">{node.data.output.usageMetadata.output_tokens}</div>
                        <div className="text-muted-foreground text-xs">Output Tokens</div>
                      </div>
                      <div className="text-center p-2 bg-secondary/30 rounded">
                        <div className="font-semibold">{node.data.output.usageMetadata.total_tokens}</div>
                        <div className="text-muted-foreground text-xs">Total Tokens</div>
                      </div>
                    </div>
                  )}

                  {node.data.output.availableTools && node.data.output.availableTools.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Available Tools:</h5>
                      <div className="space-y-2">
                        {node.data.output.availableTools.map((tool, index) => (
                          <div key={index} className="bg-secondary/30 p-2 rounded text-xs">
                            <div className="font-medium">{tool.name}</div>
                            <div className="text-muted-foreground">{tool.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Chat History */}
            {node.data.chatHistory && node.data.chatHistory.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 font-semibold mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat History
                </h4>
                {renderMessages(node.data.chatHistory)}
              </div>
            )}
          </GlassCardContent>
        )}
      </GlassCard>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Response */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            Flowise Analysis Results
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-primary/10 border border-primary/20 rounded-lg">
              <h3 className="font-semibold mb-2">Final Response:</h3>
              <p className="text-foreground leading-relaxed">{response.text}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-secondary/30 rounded-lg">
                <div className="font-semibold">{response.agentFlowExecutedData.length}</div>
                <div className="text-muted-foreground">Agents Executed</div>
              </div>
              <div className="text-center p-3 bg-secondary/30 rounded-lg">
                <div className="font-mono text-xs">{response.chatId.slice(0, 8)}...</div>
                <div className="text-muted-foreground">Chat ID</div>
              </div>
              <div className="text-center p-3 bg-secondary/30 rounded-lg">
                <div className="font-mono text-xs">{response.executionId.slice(0, 8)}...</div>
                <div className="text-muted-foreground">Execution ID</div>
              </div>
              <div className="text-center p-3 bg-secondary/30 rounded-lg">
                <div className="font-mono text-xs">{response.sessionId.slice(0, 8)}...</div>
                <div className="text-muted-foreground">Session ID</div>
              </div>
            </div>
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Agent Flow Data */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-400" />
            Agent Flow Execution Data
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="space-y-4">
            {response.agentFlowExecutedData.map(renderNodeData)}
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Raw Response Toggle */}
      <GlassCard>
        <GlassCardHeader>
          <div className="flex items-center justify-between">
            <GlassCardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Raw API Response
            </GlassCardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRawResponse(!showRawResponse)}
            >
              {showRawResponse ? 'Hide' : 'Show'} Raw Data
            </Button>
          </div>
        </GlassCardHeader>
        {showRawResponse && (
          <GlassCardContent>
            <pre className="text-xs bg-secondary/30 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(response, null, 2)}
            </pre>
          </GlassCardContent>
        )}
      </GlassCard>
    </div>
  );
}
