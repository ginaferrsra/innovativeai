'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormTemplate, FormField, FormValidator, CRIMINAL_INTAKE_FORM, CIVIL_INTAKE_FORM } from '@/lib/form-library';
import { CheckCircle2, AlertCircle, Save, Loader2 } from 'lucide-react';

interface DynamicFormBuilderProps {
  template?: FormTemplate;
  onSubmit?: (data: Record<string, any>) => void;
  performAnalysis?: boolean;
}

export function DynamicFormBuilder({ template = CRIMINAL_INTAKE_FORM, onSubmit, performAnalysis = true }: DynamicFormBuilderProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(template.sections.filter((s) => s.defaultOpen).map((s) => s.id))
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = FormValidator.validateForm(template, formData);

    // Check conditionals
    const conditionalFields = FormValidator.checkConditionals(template, formData);
    const conditionalErrors: Record<string, string> = {};

    for (const fieldName of conditionalFields) {
      const field = template.fields.find((f) => f.name === fieldName);
      if (field && (!formData[fieldName] || formData[fieldName] === '')) {
        conditionalErrors[fieldName] = `${field.label} is required based on your previous answers`;
      }
    }

    const allErrors = { ...newErrors, ...conditionalErrors };
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  }, [template, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate form processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitSuccess(true);
      onSubmit?.(formData);

      // Reset form
      setTimeout(() => {
        setFormData({});
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('[v0] Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField): React.ReactNode => {
    const value = formData[field.name] ?? '';
    const error = errors[field.name];

    // Determine if field should be shown
    if (field.conditional) {
      const conditionValue = formData[field.conditional.field];
      let shouldShow = false;

      switch (field.conditional.operator) {
        case 'equals':
          shouldShow = conditionValue === field.conditional.value;
          break;
        case 'contains':
          shouldShow = Array.isArray(conditionValue) && conditionValue.includes(field.conditional.value);
          break;
        case 'greater':
          shouldShow = conditionValue > field.conditional.value;
          break;
        case 'less':
          shouldShow = conditionValue < field.conditional.value;
          break;
      }

      if (!shouldShow) return null;
    }

    const fieldClass = `space-y-2 ${error ? 'ring-2 ring-destructive rounded-lg p-3' : ''}`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <div key={field.id} className={fieldClass}>
            <label className="block text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <Input
              type={field.type}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              disabled={isSubmitting}
              className={error ? 'border-destructive' : ''}
            />
            {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );

      case 'textarea':
      case 'rich_text':
        return (
          <div key={field.id} className={fieldClass}>
            <label className="block text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              disabled={isSubmitting}
              className={`w-full min-h-24 p-2 border rounded-md resize-none ${error ? 'border-destructive' : ''}`}
            />
            {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className={fieldClass}>
            <label className="block text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <Input
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              disabled={isSubmitting}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className={fieldClass}>
            <label className="block text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              disabled={isSubmitting}
              className={`w-full p-2 border rounded-md bg-background ${error ? 'border-destructive' : ''}`}
            >
              <option value="">Select {field.label.toLowerCase()}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );

      case 'multiselect':
        return (
          <div key={field.id} className={fieldClass}>
            <label className="block text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Array.isArray(value) && value.includes(opt.value)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = e.target.checked
                        ? [...currentValues, opt.value]
                        : currentValues.filter((v) => v !== opt.value);
                      handleFieldChange(field.name, newValues);
                    }}
                    disabled={isSubmitting}
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );

      case 'currency':
        return (
          <div key={field.id} className={fieldClass}>
            <label className="block text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">$</span>
              <Input
                type="number"
                value={value}
                onChange={(e) => handleFieldChange(field.name, parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                disabled={isSubmitting}
                className={error ? 'border-destructive' : ''}
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">{template.name}</h2>
          <p className="text-muted-foreground mt-1">{template.description}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {template.sections.map((section) => (
            <div key={section.id} className="border rounded-lg">
              {/* Section Header */}
              <button
                type="button"
                onClick={() => section.collapsible && toggleSection(section.id)}
                className={`w-full p-4 flex items-center justify-between hover:bg-muted transition-colors ${
                  section.collapsible ? 'cursor-pointer' : ''
                }`}
              >
                <div className="text-left">
                  <h3 className="font-semibold">{section.title}</h3>
                  {section.description && <p className="text-sm text-muted-foreground mt-0.5">{section.description}</p>}
                </div>
                {section.collapsible && (
                  <div className={`transform transition-transform ${expandedSections.has(section.id) ? '' : '-rotate-90'}`}>
                    ▼
                  </div>
                )}
              </button>

              {/* Section Fields */}
              {(!section.collapsible || expandedSections.has(section.id)) && (
                <div className="p-4 border-t space-y-4">
                  {section.fields.map((fieldId) => {
                    const field = template.fields.find((f) => f.id === fieldId);
                    return field ? renderField(field) : null;
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex gap-2 justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || submitSuccess}
              className="gap-2"
              size="lg"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitSuccess && <CheckCircle2 className="w-4 h-4" />}
              {isSubmitting ? 'Processing...' : submitSuccess ? 'Form Submitted' : 'Submit Form'}
            </Button>
          </div>
        </form>

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Form submitted successfully and queued for analysis</span>
          </div>
        )}

        {/* Errors Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-destructive">Please fix the following errors:</h4>
              <ul className="list-disc list-inside text-sm text-destructive/80 mt-2">
                {Object.values(errors).map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
