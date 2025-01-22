import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import crypto from 'crypto';
import { useSocket } from './useSocket';

interface Message {
  content: string;
  messageId: string;
  chatId: string;
  role: 'user' | 'assistant';
  sources?: Document[];
  suggestions?: any;
  createdAt: Date;
}

interface WebSocketMessage {
  type: 'message' | 'sources' | 'error' | 'messageEnd';
  data: any;
  messageId?: string;
}

export const useWebSocketMessageHandler = () => {
  const [fileIds, setFileIds] = useState<string[]>([]);
  const [isWSReady, setIsWSReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const ws = useSocket(
    process.env.NEXT_PUBLIC_WS_URL!,
    setIsWSReady,
    setHasError,
  );

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageAppeared, setMessageAppeared] = useState(false);
  const [chatHistory, setChatHistory] = useState<[string, string][]>([]);
  const messagesRef = useRef(messages);

  const sendMessage = async (message: string, messageId?: string) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      toast.error('Cannot send message while disconnected');
      return;
    }

    setLoading(true);
    setMessageAppeared(false);

    const messageState = {
      sources: undefined as Document[] | undefined,
      receivedMessage: '',
      added: false,
    };

    messageId = messageId ?? crypto.randomBytes(7).toString('hex');
    const chatId = crypto.randomBytes(6).toString('hex');

    // Send initial message
    ws.send(
      JSON.stringify({
        type: 'message',
        message: {
          messageId,
          chatId,
          content: message,
        },
        files: fileIds,
        focusMode: 'webSearch',
        optimizationMode: 'speed',
        history: [...chatHistory, ['human', message]],
      }),
    );

    // Add user message to state
    setMessages((prev) => [
      ...prev,
      {
        content: message,
        messageId,
        chatId,
        role: 'user',
        createdAt: new Date(),
      },
    ]);

    const handleMessage = async (event: MessageEvent) => {
      const data: WebSocketMessage = JSON.parse(event.data);

      switch (data.type) {
        case 'error':
          toast.error(data.data);
          setLoading(false);
          return;

        case 'sources':
          messageState.sources = data.data;
          if (!messageState.added) {
            addInitialAssistantMessage(data.messageId!, messageState.sources);
            messageState.added = true;
          }
          setMessageAppeared(true);
          break;

        case 'message':
          if (!messageState.added) {
            addInitialAssistantMessage(data.messageId!, messageState.sources);
            messageState.added = true;
          }
          updateAssistantMessage(data.messageId!, data.data);
          messageState.receivedMessage += data.data;
          setMessageAppeared(true);
          break;

        case 'messageEnd':
          await handleMessageEnd(message, messageState.receivedMessage);
          cleanup();
          break;
      }
    };

    const addInitialAssistantMessage = (
      messageId: string,
      sources?: Document[],
    ) => {
      setMessages((prev) => [
        ...prev,
        {
          content: '',
          messageId,
          chatId,
          role: 'assistant',
          sources,
          createdAt: new Date(),
        },
      ]);
    };

    const updateAssistantMessage = (messageId: string, newContent: string) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === messageId
            ? { ...msg, content: msg.content + newContent }
            : msg,
        ),
      );
    };

    const handleMessageEnd = async (
      originalMessage: string,
      receivedMessage: string,
    ) => {
      setChatHistory((prev) => [
        ...prev,
        ['human', originalMessage],
        ['assistant', receivedMessage],
      ]);
      setLoading(false);

      const lastMsg = messagesRef.current[messagesRef.current.length - 1];
      //   if (
      //     lastMsg.role === 'assistant' &&
      //     lastMsg.sources?.length &&
      //     !lastMsg.suggestions
      //   ) {
      //     const suggestions = await getSuggestions(messagesRef.current);
      //     updateMessageSuggestions(lastMsg.messageId, suggestions);
      //   }
    };

    const updateMessageSuggestions = (messageId: string, suggestions: any) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === messageId ? { ...msg, suggestions } : msg,
        ),
      );
    };

    const cleanup = () => {
      ws.removeEventListener('message', handleMessage);
    };

    ws.addEventListener('message', handleMessage);
  };

  return {
    sendMessage,
    loading,
    messages,
    messageAppeared,
  };
};
