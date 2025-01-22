'use client';

import {
  AudioWaveform,
  Calendar,
  ChevronsUpDown,
  Command,
  GalleryVerticalEnd,
  Home,
  Inbox,
  Plus,
  Search,
  Settings,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useMultiSidebar,
} from '@/components/ui/multisidebar';
import type * as React from 'react';
import ChatInput, { type chatInputFormSchema } from './ChatInput';
import SidebarChatMenu from './SidebarChatMenu';
import { PiCaretDoubleRightBold } from 'react-icons/pi';
import { useWebSocketMessageHandler } from '@/lib/actions';
import type { z } from 'zod';
import type { SubmitHandler } from 'react-hook-form';

export const SidebarChatWrapper: React.FunctionComponent = () => {
  const { sendMessage, messages, loading, messageAppeared } =
    useWebSocketMessageHandler();

  const onSubmit: SubmitHandler<z.infer<typeof chatInputFormSchema>> = (
    data,
  ) => {
    sendMessage(data.message);
  };

  return (
    <Sidebar side="right" className="border-muted-foreground">
      <SidebarContent className="bg-secondary flex flex-col justify-between h-screen gap-0">
        <SidebarHeader className="flex items-center justify-between p-4 ">
          <SidebarTrigger side="right" className="bg-secondary">
            <PiCaretDoubleRightBold className="w-6 h-6 text-2xl" />
          </SidebarTrigger>
          <h1 className="font-bold text-xl text-foreground">AcadAI</h1>
        </SidebarHeader>

        <SidebarGroup className="flex-grow overflow-hidden ">
          <SidebarGroupContent className="h-full overflow-y-auto ">
            <SidebarMenu className="h-full px-2 ">
              <SidebarChatMenu
                loading={loading}
                messageAppeared={messageAppeared}
                messages={messages}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <ChatInput onSubmit={onSubmit} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};
