import { NextRequest, NextResponse } from 'next/server';
import { orchestrator, initializeDefaultAgents, TaskRequest } from '@/lib/multi-agent-orchestrator';
import { errorManagementSystem } from '@/lib/error-detection-system';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[v0] Received agent execution request:', body.type);

    // Initialize agents if not already done
    if (orchestrator.agents.size === 0) {
      initializeDefaultAgents();
    }

    const taskRequest: TaskRequest = {
      id: `task-${Date.now()}-${Math.random()}`,
      type: body.type || 'analysis',
      description: body.description,
      context: body.context || {},
      required_agents: body.agents || ['legal_researcher', 'charter_analyzer'],
      priority: body.priority || 'medium',
      deadline: body.deadline ? new Date(body.deadline) : undefined,
    };

    // Execute task with error handling
    try {
      const result = await orchestrator.executeTask(taskRequest);
      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      const handledError = await errorManagementSystem.handleError(error);
      return NextResponse.json(
        {
          error: handledError.error,
          healing_action: handledError.healing,
          status: 'error_with_healing_attempt',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[v0] Agent API error:', error);
    const handledError = await errorManagementSystem.handleError(error);
    return NextResponse.json(
      { error: handledError.error, status: 'failed' },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const status = orchestrator.getSystemStatus();
    const diagnostics = errorManagementSystem.getSystemDiagnostics();

    return NextResponse.json(
      {
        system_status: status,
        diagnostics,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
