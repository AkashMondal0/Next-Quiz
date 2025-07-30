import { useEffect, useState, useCallback, useRef } from 'react';
import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import api from '@/lib/axios';

type UseAxiosOptions = {
  manual?: boolean;
};

type UseAxiosReturn<T> = {
  data: T | null;
  error: AxiosError | null;
  loading: boolean;
  refetch: (overrideConfig?: AxiosRequestConfig) => Promise<T>;
  setConfig: React.Dispatch<React.SetStateAction<AxiosRequestConfig>>;
};

export function useAxios<T = any>(
  initialConfig: AxiosRequestConfig,
  { manual = false }: UseAxiosOptions = {}
): UseAxiosReturn<T> {
  const [config, setConfig] = useState<AxiosRequestConfig>(initialConfig);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState<boolean>(!manual);
  const controllerRef = useRef<AbortController | null>(null);

  const sendRequest = useCallback(
    async (overrideConfig: AxiosRequestConfig = {}): Promise<T> => {
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const response: AxiosResponse<T> = await api.request({
          ...config,
          ...overrideConfig,
          signal: controllerRef.current.signal,
        });
        setData(response.data);
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.name !== 'CanceledError') {
          setError(axiosError);
        }
        throw axiosError;
      } finally {
        setLoading(false);
      }
    },
    [config]
  );

  useEffect(() => {
    if (!manual) {
      sendRequest();
    }
    return () => controllerRef.current?.abort();
  }, [config, manual, sendRequest]);

  return {
    data,
    error,
    loading,
    refetch: sendRequest,
    setConfig,
  };
}
