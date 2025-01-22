import { Message } from '@/types/slate';
import * as React from 'react';
import { RiQuillPenAiFill } from 'react-icons/ri';
import UserPrompt from './UserPrompt';
import { formatAIResponse } from '../../utils/format-text';
import MessageBox from './MessageBox';

type SidebarChatMenuProps = {
  messages: Message[];
  loading: boolean;
  messageAppeared: boolean;
};
const SidebarChatMenu: React.FunctionComponent<SidebarChatMenuProps> = (
  props,
) => {
  return (
    <div className=" flex flex-col justify-center ">
      {props.messages.length == 0 ? (
        <div className="flex flex-col items-center justify-center gap-y-2 h-full ">
          <RiQuillPenAiFill className="text-6xl text-muted-foreground" />
          <h1 className="text-2xl text-muted-foreground font-semibold">
            Ask AcadAI
          </h1>
          <p className="text-sm text-muted-foreground text-balance">
            Ask AcadAI anything and it will respond to you.
          </p>
        </div>
      ) : (
        props.messages.map((message, id) => {
          return (
            <div key={id} className="flex flex-col">
              {id % 2 === 0 ? (
                <div className="mb-3">
                  <UserPrompt />
                  <span className="font-bold text-lg mt-1">
                    {message.content}
                  </span>
                  {props.loading &&
                    props.messageAppeared &&
                    id === props.messages.length - 1 && (
                      <p className="text-sm text-muted-foreground font-semibold">
                        Loading...
                      </p>
                    )}
                </div>
              ) : (
                <MessageBox message={message} messageIndex={id} />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default SidebarChatMenu;
