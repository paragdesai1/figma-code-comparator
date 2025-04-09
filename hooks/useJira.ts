import { useState, useEffect, useCallback } from 'react';
import { JiraService } from '../services/jiraService';

interface JiraSettings {
  email: string;
  apiToken: string;
  baseUrl: string;
  projectKey: string;
}

interface UseJiraReturn {
  isConfigured: boolean;
  settings: JiraSettings | null;
  service: JiraService | null;
  createIssue: (payload: {
    title: string;
    description: string;
    type: string;
    priority: string;
    screenshot?: string;
  }) => Promise<any>;
  validateSettings: () => Promise<boolean>;
  updateSettings: (settings: JiraSettings) => Promise<void>;
}

const STORAGE_KEY = 'jira_settings';

export function useJira(): UseJiraReturn {
  const [settings, setSettings] = useState<JiraSettings | null>(null);
  const [service, setService] = useState<JiraService | null>(null);

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      setService(new JiraService(parsedSettings));
    }
  }, []);

  const updateSettings = useCallback(async (newSettings: JiraSettings) => {
    const newService = new JiraService(newSettings);
    
    // Validate settings before saving
    const isValid = await newService.validateSettings();
    if (!isValid) {
      throw new Error('Invalid Jira settings. Please check your credentials and try again.');
    }

    // Save settings to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    setSettings(newSettings);
    setService(newService);
  }, []);

  const createIssue = useCallback(async (payload: {
    title: string;
    description: string;
    type: string;
    priority: string;
    screenshot?: string;
  }) => {
    if (!service) {
      throw new Error('Jira service not initialized. Please configure Jira settings first.');
    }
    return service.createIssue(payload);
  }, [service]);

  const validateSettings = useCallback(async () => {
    if (!service) {
      return false;
    }
    return service.validateSettings();
  }, [service]);

  return {
    isConfigured: !!service,
    settings,
    service,
    createIssue,
    validateSettings,
    updateSettings,
  };
} 