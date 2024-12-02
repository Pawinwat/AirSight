import { AxiosRequestConfig } from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getInstanceStatus,
  getDags,
  getDagDetails,
  triggerDag,
  getDagRuns,
  getDagRunDetails,
  getTaskInstances,
  getTaskInstanceDetails,
  updateDag,
} from './index';

const defaultConfig: AxiosRequestConfig = {
  baseURL: 'https://airflow.example.com', // Replace with your Airflow base URL.
  headers: {
    Authorization: 'Bearer YOUR_TOKEN', // Replace with your actual token mechanism.
  },
};

export const useInstanceStatus = (config: AxiosRequestConfig = defaultConfig) => {
  return useQuery({
    queryKey: ['instanceStatus'],
    queryFn: () => getInstanceStatus(config),
  });
};

export const useDags = (params: Record<string, any> = {}, config: AxiosRequestConfig = defaultConfig) => {
  return useQuery({
    queryKey: ['dags', params],
    queryFn: () => getDags({ ...config, params }),
  });
};

export const useDagDetails = (
  dagId: string,
  config: AxiosRequestConfig = defaultConfig
) => {
  return useQuery({
    queryKey: ['dagDetails', dagId],
    queryFn: () => getDagDetails({ ...config }, dagId),
  });
};

export const useTriggerDag = (config: AxiosRequestConfig = defaultConfig) => {
  return useMutation({
    mutationFn: ({ dagId, payload }: { dagId: string; payload: Record<string, any> }) =>
      triggerDag(config, dagId, payload),
  });
};

export const useDagRuns = (
  dagId: string,
  params: Record<string, any> = {},
  config: AxiosRequestConfig = defaultConfig
) => {
  return useQuery({
    queryKey: ['dagRuns', dagId, params],
    queryFn: () => getDagRuns({ ...config, params }, dagId),
  });
};

export const useDagRunDetails = (
  dagId: string,
  runId: string,
  config: AxiosRequestConfig = defaultConfig
) => {
  return useQuery({
    queryKey: ['dagRunDetails', dagId, runId],
    queryFn: () => getDagRunDetails(config, dagId, runId),
  });
};

export const useTaskInstances = (
  dagId: string,
  runId: string,
  params: Record<string, any> = {},
  config: AxiosRequestConfig = defaultConfig
) => {
  return useQuery({
    queryKey: ['taskInstances', dagId, runId, params],
    queryFn: () => getTaskInstances({ ...config, params }, dagId, runId),
  });
};

export const useTaskInstanceDetails = (
  dagId: string,
  runId: string,
  taskId: string,
  config: AxiosRequestConfig = defaultConfig
) => {
  return useQuery({
    queryKey: ['taskInstanceDetails', dagId, runId, taskId],
    queryFn: () => getTaskInstanceDetails(config, dagId, runId, taskId),
  });
};

export const useUpdateDag = (config: AxiosRequestConfig = defaultConfig) => {
  return useMutation({
    mutationFn: ({ dagId, payload }: { dagId: string; payload: Record<string, any> }) =>
      updateDag(config, dagId, payload),
  });
};
