import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export const useSocket = (
  url: string,
  setIsWSReady: (ready: boolean) => void,
  setError: (error: boolean) => void,
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const isCleaningUpRef = useRef(false);
  const MAX_RETRIES = 3;
  const INITIAL_BACKOFF = 1000; // 1 second

  const getBackoffDelay = (retryCount: number) => {
    return Math.min(INITIAL_BACKOFF * Math.pow(2, retryCount), 10000); // Cap at 10 seconds
  };

  useEffect(() => {
    const connectWs = async () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }

      try {
        let chatModel = localStorage.getItem('chatModel');
        let chatModelProvider = localStorage.getItem('chatModelProvider');
        let embeddingModel = localStorage.getItem('embeddingModel');
        let embeddingModelProvider = localStorage.getItem(
          'embeddingModelProvider',
        );
        let openAIBaseURL =
          chatModelProvider === 'custom_openai'
            ? localStorage.getItem('openAIBaseURL')
            : null;
        let openAIPIKey =
          chatModelProvider === 'custom_openai'
            ? localStorage.getItem('openAIApiKey')
            : null;

        const providers = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/models`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ).then(async (res) => {
          if (!res.ok)
            throw new Error(
              `Failed to fetch models: ${res.status} ${res.statusText}`,
            );
          return res.json();
        });

        if (
          !chatModel ||
          !chatModelProvider ||
          !embeddingModel ||
          !embeddingModelProvider
        ) {
          if (!chatModel || !chatModelProvider) {
            const chatModelProviders = providers.chatModelProviders;

            chatModelProvider =
              chatModelProvider || Object.keys(chatModelProviders)[0];

            if (chatModelProvider === 'custom_openai') {
              toast.error(
                'Seems like you are using the custom OpenAI provider, please open the settings and enter a model name to use.',
              );
              setError(true);
              return;
            } else {
              chatModel = Object.keys(chatModelProviders[chatModelProvider])[0];

              if (
                !chatModelProviders ||
                Object.keys(chatModelProviders).length === 0
              )
                return toast.error('No chat models available');
            }
          }

          if (!embeddingModel || !embeddingModelProvider) {
            const embeddingModelProviders = providers.embeddingModelProviders;

            if (
              !embeddingModelProviders ||
              Object.keys(embeddingModelProviders).length === 0
            )
              return toast.error('No embedding models available');

            embeddingModelProvider = Object.keys(embeddingModelProviders)[0];
            embeddingModel = Object.keys(
              embeddingModelProviders[embeddingModelProvider],
            )[0];
          }

          localStorage.setItem('chatModel', chatModel!);
          localStorage.setItem('chatModelProvider', chatModelProvider);
          localStorage.setItem('embeddingModel', embeddingModel!);
          localStorage.setItem(
            'embeddingModelProvider',
            embeddingModelProvider,
          );
        } else {
          const chatModelProviders = providers.chatModelProviders;
          const embeddingModelProviders = providers.embeddingModelProviders;

          if (
            Object.keys(chatModelProviders).length > 0 &&
            (((!openAIBaseURL || !openAIPIKey) &&
              chatModelProvider === 'custom_openai') ||
              !chatModelProviders[chatModelProvider])
          ) {
            const chatModelProvidersKeys = Object.keys(chatModelProviders);
            chatModelProvider =
              chatModelProvidersKeys.find(
                (key) => Object.keys(chatModelProviders[key]).length > 0,
              ) || chatModelProvidersKeys[0];

            if (
              chatModelProvider === 'custom_openai' &&
              (!openAIBaseURL || !openAIPIKey)
            ) {
              toast.error(
                'Seems like you are using the custom OpenAI provider, please open the settings and configure the API key and base URL',
              );
              setError(true);
              return;
            }

            localStorage.setItem('chatModelProvider', chatModelProvider);
          }

          if (
            chatModelProvider &&
            (!openAIBaseURL || !openAIPIKey) &&
            !chatModelProviders[chatModelProvider][chatModel]
          ) {
            chatModel = Object.keys(
              chatModelProviders[
                Object.keys(chatModelProviders[chatModelProvider]).length > 0
                  ? chatModelProvider
                  : Object.keys(chatModelProviders)[0]
              ],
            )[0];
            localStorage.setItem('chatModel', chatModel);
          }

          if (
            Object.keys(embeddingModelProviders).length > 0 &&
            !embeddingModelProviders[embeddingModelProvider]
          ) {
            embeddingModelProvider = Object.keys(embeddingModelProviders)[0];
            localStorage.setItem(
              'embeddingModelProvider',
              embeddingModelProvider,
            );
          }

          if (
            embeddingModelProvider &&
            !embeddingModelProviders[embeddingModelProvider][embeddingModel]
          ) {
            embeddingModel = Object.keys(
              embeddingModelProviders[embeddingModelProvider],
            )[0];
            localStorage.setItem('embeddingModel', embeddingModel);
          }
        }

        const wsURL = new URL(url);
        const searchParams = new URLSearchParams({});

        searchParams.append('chatModel', chatModel!);
        searchParams.append('chatModelProvider', chatModelProvider);

        if (chatModelProvider === 'custom_openai') {
          searchParams.append(
            'openAIApiKey',
            localStorage.getItem('openAIApiKey')!,
          );
          searchParams.append(
            'openAIBaseURL',
            localStorage.getItem('openAIBaseURL')!,
          );
        }

        searchParams.append('embeddingModel', embeddingModel!);
        searchParams.append('embeddingModelProvider', embeddingModelProvider);

        wsURL.search = searchParams.toString();

        const ws = new WebSocket(wsURL.toString());
        wsRef.current = ws;

        const timeoutId = setTimeout(() => {
          if (ws.readyState !== 1) {
            toast.error(
              'Failed to connect to the server. Please try again later.',
            );
          }
        }, 10000);

        ws.addEventListener('message', (e) => {
          const data = JSON.parse(e.data);
          if (data.type === 'signal' && data.data === 'open') {
            const interval = setInterval(() => {
              if (ws.readyState === 1) {
                setIsWSReady(true);
                setError(false);
                if (retryCountRef.current > 0) {
                  toast.success('Connection restored.');
                }
                retryCountRef.current = 0;
                clearInterval(interval);
              }
            }, 5);
            clearTimeout(timeoutId);
            console.debug(new Date(), 'ws:connected');
          }
          if (data.type === 'error') {
            toast.error(data.data);
          }
        });

        ws.onerror = () => {
          clearTimeout(timeoutId);
          setIsWSReady(false);
          toast.error('WebSocket connection error.');
        };

        ws.onclose = () => {
          clearTimeout(timeoutId);
          setIsWSReady(false);
          console.debug(new Date(), 'ws:disconnected');
          if (!isCleaningUpRef.current) {
            toast.error('Connection lost. Attempting to reconnect...');
            attemptReconnect();
          }
        };
      } catch (error) {
        console.debug(new Date(), 'ws:error', error);
        setIsWSReady(false);
        attemptReconnect();
      }
    };

    const attemptReconnect = () => {
      retryCountRef.current += 1;

      if (retryCountRef.current > MAX_RETRIES) {
        console.debug(new Date(), 'ws:max_retries');
        setError(true);
        toast.error(
          'Unable to connect to server after multiple attempts. Please refresh the page to try again.',
        );
        return;
      }

      const backoffDelay = getBackoffDelay(retryCountRef.current);
      console.debug(
        new Date(),
        `ws:retry attempt=${retryCountRef.current}/${MAX_RETRIES} delay=${backoffDelay}ms`,
      );

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      reconnectTimeoutRef.current = setTimeout(() => {
        connectWs();
      }, backoffDelay);
    };

    connectWs();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
        isCleaningUpRef.current = true;
        console.debug(new Date(), 'ws:cleanup');
      }
    };
  }, [url, setIsWSReady, setError]);

  return wsRef.current;
};
