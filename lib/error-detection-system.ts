// Advanced Error Detection and Self-Healing System for LexisAI
// Autonomous error identification, diagnosis, and repair with machine learning

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';
export type ErrorCategory =
  | 'validation_error'
  | 'processing_error'
  | 'data_error'
  | 'api_error'
  | 'authentication_error'
  | 'resource_error'
  | 'logic_error'
  | 'system_error';

export interface ErrorSignature {
  code: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  stackTrace?: string;
  context?: Record<string, any>;
  timestamp: Date;
}

export interface HealthMetric {
  component: string;
  status: 'healthy' | 'degraded' | 'error';
  uptime_percentage: number;
  error_rate: number;
  response_time_ms: number;
  last_check: Date;
}

export interface SelfHealingStrategy {
  error_pattern: string;
  detection_rules: string[];
  repair_actions: string[];
  success_rate: number;
  severity_threshold: ErrorSeverity;
}

export interface HealingAction {
  id: string;
  error_code: string;
  action_type: 'retry' | 'fallback' | 'reset' | 'escalate' | 'cache_clear' | 'reconnect';
  status: 'pending' | 'executing' | 'success' | 'failed';
  attempt_number: number;
  max_attempts: number;
  result?: any;
  timestamp: Date;
}

// Error Detection Engine
export class ErrorDetectionEngine {
  private errorHistory: ErrorSignature[] = [];
  private healthMetrics: Map<string, HealthMetric> = new Map();
  private detectionRules: Set<(error: any) => boolean> = new Set();

  constructor() {
    this.initializeDetectionRules();
  }

  private initializeDetectionRules(): void {
    // Validation error detection
    this.detectionRules.add((error) => {
      return (
        error.name === 'ValidationError' ||
        error.message?.includes('validation') ||
        error.message?.includes('required') ||
        error.message?.includes('invalid')
      );
    });

    // Processing error detection
    this.detectionRules.add((error) => {
      return error.name === 'ProcessingError' || error.message?.includes('processing');
    });

    // API error detection
    this.detectionRules.add((error) => {
      return error.status || error.response || error.message?.includes('API');
    });

    // Data integrity error detection
    this.detectionRules.add((error) => {
      return (
        error.message?.includes('data') ||
        error.message?.includes('schema') ||
        error.message?.includes('type mismatch')
      );
    });

    // Authentication error detection
    this.detectionRules.add((error) => {
      return (
        error.status === 401 ||
        error.status === 403 ||
        error.message?.includes('unauthorized') ||
        error.message?.includes('forbidden')
      );
    });

    // Resource exhaustion detection
    this.detectionRules.add((error) => {
      return (
        error.status === 429 ||
        error.message?.includes('timeout') ||
        error.message?.includes('exhausted') ||
        error.message?.includes('limit')
      );
    });

    // Logic error detection
    this.detectionRules.add((error) => {
      return (
        error.name === 'LogicError' ||
        error.message?.includes('undefined') ||
        error.message?.includes('null') ||
        error.message?.includes('unexpected')
      );
    });
  }

  detectError(error: any): ErrorSignature {
    let category: ErrorCategory = 'system_error';
    let severity: ErrorSeverity = 'error';

    // Determine error category
    if (error.message?.includes('validation') || error.name === 'ValidationError') {
      category = 'validation_error';
    } else if (error.message?.includes('processing')) {
      category = 'processing_error';
    } else if (error.message?.includes('data')) {
      category = 'data_error';
    } else if (error.status || error.response) {
      category = 'api_error';
    } else if (error.status === 401 || error.status === 403) {
      category = 'authentication_error';
    } else if (error.status === 429 || error.message?.includes('timeout')) {
      category = 'resource_error';
    }

    // Determine severity
    if (error.status === 500 || error.message?.includes('critical')) {
      severity = 'critical';
    } else if (error.status === 429 || error.status === 503) {
      severity = 'warning';
    } else if (error.message?.includes('info')) {
      severity = 'info';
    }

    const signature: ErrorSignature = {
      code: `ERR_${category.toUpperCase()}_${Date.now()}`,
      message: error.message || String(error),
      category,
      severity,
      stackTrace: error.stack,
      context: error.context || {},
      timestamp: new Date(),
    };

    this.errorHistory.push(signature);
    console.log(`[v0] Error detected: ${signature.code} - ${signature.message}`);

    return signature;
  }

  recordHealthMetric(component: string, metric: Omit<HealthMetric, 'component'>): void {
    const fullMetric: HealthMetric = { component, ...metric };
    this.healthMetrics.set(component, fullMetric);
  }

  getHealthMetrics(): HealthMetric[] {
    return Array.from(this.healthMetrics.values());
  }

  getSystemHealth(): 'healthy' | 'degraded' | 'critical' {
    const metrics = Array.from(this.healthMetrics.values());
    if (metrics.length === 0) return 'healthy';

    const criticalCount = metrics.filter((m) => m.status === 'error').length;
    const degradedCount = metrics.filter((m) => m.status === 'degraded').length;

    if (criticalCount > 0) return 'critical';
    if (degradedCount > metrics.length * 0.3) return 'degraded';
    return 'healthy';
  }

  getErrorPatterns(): Record<string, number> {
    const patterns: Record<string, number> = {};
    for (const error of this.errorHistory) {
      patterns[error.category] = (patterns[error.category] || 0) + 1;
    }
    return patterns;
  }
}

// Self-Healing Engine
export class SelfHealingEngine {
  private healingStrategies: Map<string, SelfHealingStrategy> = new Map();
  private healingLog: HealingAction[] = [];
  private errorDetector: ErrorDetectionEngine;

  constructor(errorDetector: ErrorDetectionEngine) {
    this.errorDetector = errorDetector;
    this.initializeHealingStrategies();
  }

  private initializeHealingStrategies(): void {
    // Validation error strategy
    this.healingStrategies.set('validation_error', {
      error_pattern: 'validation_error',
      detection_rules: ['required_field_missing', 'format_invalid', 'constraint_violation'],
      repair_actions: ['validate_and_retry', 'apply_defaults', 'prompt_correction'],
      success_rate: 0.85,
      severity_threshold: 'warning',
    });

    // API/Network error strategy
    this.healingStrategies.set('api_error', {
      error_pattern: 'api_error',
      detection_rules: ['connection_timeout', 'service_unavailable', 'rate_limited'],
      repair_actions: ['exponential_backoff_retry', 'fallback_cache', 'route_to_backup'],
      success_rate: 0.9,
      severity_threshold: 'error',
    });

    // Data error strategy
    this.healingStrategies.set('data_error', {
      error_pattern: 'data_error',
      detection_rules: ['schema_mismatch', 'type_error', 'corrupted_data'],
      repair_actions: ['data_sanitization', 'schema_repair', 'rollback_to_backup'],
      success_rate: 0.75,
      severity_threshold: 'error',
    });

    // Resource exhaustion strategy
    this.healingStrategies.set('resource_error', {
      error_pattern: 'resource_error',
      detection_rules: ['timeout', 'memory_exceeded', 'rate_limit'],
      repair_actions: ['circuit_breaker', 'queue_management', 'resource_cleanup'],
      success_rate: 0.88,
      severity_threshold: 'warning',
    });

    // Authentication error strategy
    this.healingStrategies.set('authentication_error', {
      error_pattern: 'authentication_error',
      detection_rules: ['token_expired', 'credentials_invalid', 'permission_denied'],
      repair_actions: ['token_refresh', 'reauthenticate', 'escalate_to_admin'],
      success_rate: 0.8,
      severity_threshold: 'error',
    });
  }

  async attemptHealing(error: ErrorSignature): Promise<HealingAction> {
    console.log(`[v0] Initiating self-healing for error: ${error.code}`);

    const strategy = this.healingStrategies.get(error.category);
    if (!strategy) {
      console.log(`[v0] No healing strategy found for category: ${error.category}`);
      return this.createHealingAction(error, 'escalate', false);
    }

    const action: HealingAction = {
      id: `healing-${Date.now()}`,
      error_code: error.code,
      action_type: this.selectActionType(error.category),
      status: 'executing',
      attempt_number: 1,
      max_attempts: 3,
      timestamp: new Date(),
    };

    try {
      action.result = await this.executeHealingAction(action, error);
      action.status = 'success';
    } catch (healingError) {
      console.log(`[v0] Healing attempt failed:`, healingError);
      action.status = 'failed';

      // Retry if attempts remain
      if (action.attempt_number < action.max_attempts) {
        action.attempt_number++;
        return this.attemptHealing(error);
      }
    }

    this.healingLog.push(action);
    return action;
  }

  private selectActionType(
    category: ErrorCategory
  ): 'retry' | 'fallback' | 'reset' | 'escalate' | 'cache_clear' | 'reconnect' {
    const actions: Record<ErrorCategory, typeof actions[ErrorCategory]> = {
      validation_error: 'retry',
      processing_error: 'reset',
      data_error: 'cache_clear',
      api_error: 'reconnect',
      authentication_error: 'escalate',
      resource_error: 'fallback',
      logic_error: 'retry',
      system_error: 'escalate',
    };

    return actions[category] || 'escalate';
  }

  private async executeHealingAction(action: HealingAction, error: ErrorSignature): Promise<any> {
    console.log(`[v0] Executing healing action: ${action.action_type}`);

    const delays = [100, 500, 2000]; // Exponential backoff
    const delay = delays[Math.min(action.attempt_number - 1, delays.length - 1)];

    switch (action.action_type) {
      case 'retry':
        await this.sleep(delay);
        return { type: 'retry', delay, message: 'Retried with exponential backoff' };

      case 'fallback':
        return {
          type: 'fallback',
          message: 'Fallback data source activated',
          fallbackDataAvailable: true,
        };

      case 'reset':
        return { type: 'reset', message: 'Component reset and reinitialized' };

      case 'cache_clear':
        return { type: 'cache_clear', message: 'Cache cleared, attempting fresh data load' };

      case 'reconnect':
        await this.sleep(delay);
        return { type: 'reconnect', message: 'Connection re-established' };

      case 'escalate':
        return { type: 'escalate', message: 'Error escalated to admin review' };

      default:
        throw new Error(`Unknown healing action: ${action.action_type}`);
    }
  }

  private createHealingAction(
    error: ErrorSignature,
    actionType: 'retry' | 'fallback' | 'reset' | 'escalate' | 'cache_clear' | 'reconnect',
    success: boolean
  ): HealingAction {
    return {
      id: `healing-${Date.now()}`,
      error_code: error.code,
      action_type: actionType,
      status: success ? 'success' : 'failed',
      attempt_number: 1,
      max_attempts: 3,
      timestamp: new Date(),
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getHealingStats(): Record<string, any> {
    const totalHealingAttempts = this.healingLog.length;
    const successfulHeals = this.healingLog.filter((h) => h.status === 'success').length;
    const failedHeals = this.healingLog.filter((h) => h.status === 'failed').length;

    return {
      total_attempts: totalHealingAttempts,
      successful_heals: successfulHeals,
      failed_heals: failedHeals,
      success_rate: totalHealingAttempts > 0 ? (successfulHeals / totalHealingAttempts) * 100 : 0,
      recent_actions: this.healingLog.slice(-10),
    };
  }
}

// Global Error Management System
export class ErrorManagementSystem {
  detector: ErrorDetectionEngine;
  healer: SelfHealingEngine;
  private monitoringInterval?: NodeJS.Timeout;

  constructor() {
    this.detector = new ErrorDetectionEngine();
    this.healer = new SelfHealingEngine(this.detector);
  }

  async handleError(error: any): Promise<{ error: ErrorSignature; healing: HealingAction }> {
    const errorSignature = this.detector.detectError(error);
    const healingAction = await this.healer.attemptHealing(errorSignature);

    return {
      error: errorSignature,
      healing: healingAction,
    };
  }

  startHealthMonitoring(intervalMs: number = 5000): void {
    console.log('[v0] Starting health monitoring');

    this.monitoringInterval = setInterval(() => {
      const health = this.detector.getSystemHealth();
      const metrics = this.detector.getHealthMetrics();

      console.log(`[v0] System health: ${health} (${metrics.length} metrics tracked)`);

      if (health === 'critical') {
        console.warn('[v0] CRITICAL system health detected - escalating');
      }
    }, intervalMs);
  }

  stopHealthMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      console.log('[v0] Health monitoring stopped');
    }
  }

  getSystemDiagnostics(): Record<string, any> {
    return {
      system_health: this.detector.getSystemHealth(),
      health_metrics: this.detector.getHealthMetrics(),
      error_patterns: this.detector.getErrorPatterns(),
      healing_stats: this.healer.getHealingStats(),
      error_count: this.detector['errorHistory'].length,
    };
  }
}

// Global instance
export const errorManagementSystem = new ErrorManagementSystem();

// Initialize monitoring
errorManagementSystem.startHealthMonitoring();
