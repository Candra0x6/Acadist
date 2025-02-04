import { Message } from '@/types/slate';
import * as React from 'react';
import Markdown from 'markdown-to-jsx';
import MessageSources from './SourceMessage';

interface IMessageBoxProps {
  message: Message;
  messageIndex: number;
}

const MessageBox: React.FunctionComponent<IMessageBoxProps> = ({
  message,
  messageIndex,
}) => {
  const [parsedMessage, setParsedMessage] = React.useState(message.content);

  React.useEffect(() => {
    const regex = /\[(\d+)\]/g;

    if (
      message.role === 'assistant' &&
      message?.sources &&
      message.sources.length > 0
    ) {
      return setParsedMessage(
        message.content.replace(
          regex,
          (_, number) =>
            // @ts-expect-error - TS is not recognizing the href attribute
            `<a href="${message.sources?.[number - 1]?.metadata?.url}" target="_blank" className="bg-transparent px-1 rounded ml-1 no-underline text-xs text-blue-700/70 dark:text-white/70 relative">${number}</a>`,
        ),
      );
    }

    setParsedMessage(message.content);
  }, [message.content, message.sources, message.role]);
  const handleTextSelect = (selectedText: string) => {
    console.log(selectedText);
  };
  console.log(message);
  return (
    <div className="">
      {message.role === 'assistant' &&
        message.sources &&
        message.sources.length > 0 && (
          <div
            className="flex flex-col items-start text-foreground  rounded-md w-full relative"
            key={messageIndex}
          >
            <Markdown
              options={{
                overrides: {
                  h1: {
                    component: 'h1',
                    props: { className: 'text-3xl font-bold' },
                  },
                  h2: {
                    component: 'h2',
                    props: { className: 'text-lg font-bold my-1' },
                  },
                  a: {
                    component: 'a',
                    props: {
                      className:
                        'text-blue-500 hover:underline hover:bg-blue-200 border-x-2 border-blue-500',
                    },
                  },
                },
              }}
            >
              {parsedMessage}
            </Markdown>
            <div className="w-full my-7">
              {message.sources && message.sources.length > 0 && (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                <MessageSources sources={message.sources} />
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default MessageBox;
