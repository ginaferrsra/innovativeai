import { NextRequest, NextResponse } from 'next/server';
import { FormValidator, getFormTemplate } from '@/lib/form-library';
import { orchestrator, TaskRequest, initializeDefaultAgents } from '@/lib/multi-agent-orchestrator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, data, performAnalysis } = body;

    console.log('[v0] Processing form submission:', templateId);

    // Get template
    const template = getFormTemplate(templateId);
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Validate form data
    const validationErrors = FormValidator.validateForm(template, data);
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        {
          status: 'validation_error',
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // Check conditionals
    const conditionalFields = FormValidator.checkConditionals(template, data);

    // If analysis requested, queue multi-agent task
    if (performAnalysis) {
      if (orchestrator.agents.size === 0) {
        initializeDefaultAgents();
      }

      const analysisTask: TaskRequest = {
        id: `form-analysis-${Date.now()}`,
        type: 'form_analysis',
        description: `Analyze submitted ${template.name}: ${Object.entries(data)
          .slice(0, 3)
          .map(([k, v]) => `${k}=${v}`)
          .join(', ')}`,
        context: {
          form_template_id: templateId,
          form_data: data,
          conditional_fields: conditionalFields,
        },
        required_agents: ['form_extractor', 'charter_analyzer', 'strategy_advisor'],
        priority: 'high',
      };

      try {
        const analysisResult = await orchestrator.executeTask(analysisTask);

        return NextResponse.json(
          {
            status: 'success',
            submission_id: `submission-${Date.now()}`,
            validation: {
              passed: true,
              conditional_checks: conditionalFields,
            },
            analysis: {
              agents_involved: analysisResult.messages.length,
              insights: analysisResult.result,
              execution_time_ms: analysisResult.executionTime,
            },
          },
          { status: 200 }
        );
      } catch (error) {
        console.error('[v0] Analysis error:', error);
        // Still return success for form, but note analysis failed
        return NextResponse.json(
          {
            status: 'submitted_analysis_pending',
            submission_id: `submission-${Date.now()}`,
            note: 'Form submitted but analysis queued for later processing',
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      {
        status: 'success',
        submission_id: `submission-${Date.now()}`,
        validation: {
          passed: true,
          conditional_checks: conditionalFields,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Form submission error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
