'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PiPaperPlaneRightFill } from 'react-icons/pi';
import { VscGlobe } from 'react-icons/vsc';
import { useWebSocketMessageHandler } from '@/lib/actions';
import { Message } from '@/types/slate';
import { set } from 'lodash';

export const chatInputFormSchema = z.object({
  message: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

type ChatInputProps = {
  onSubmit: SubmitHandler<z.infer<typeof chatInputFormSchema>>;
};
const ChatInput: React.FunctionComponent<ChatInputProps> = (props) => {
  const form = useForm<z.infer<typeof chatInputFormSchema>>({
    resolver: zodResolver(chatInputFormSchema),
    defaultValues: {
      message: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className="space-y-8">
        <div className="border border-foreground rounded-xl flex-col flex p-2">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        form.handleSubmit(props.onSubmit)();
                      }
                    }}
                    className="border-0 focus:ring-0 focus-visible:ring-0"
                    placeholder="shadcn"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-between items-center">
            <VscGlobe className="text-xl" />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="self-end hover:bg-transparent"
            >
              <PiPaperPlaneRightFill className="text-2xl" />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ChatInput;
