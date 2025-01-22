import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import * as React from 'react';

const UserPrompt: React.FunctionComponent = () => {
  return (
    <div className="flex items-center w-full gap-x-2">
      <Avatar className="w-7 h-7">
        <AvatarFallback className="bg-primary text-white">CN</AvatarFallback>
      </Avatar>
      <h1 className="font-bold text-xs">Candra0x6</h1>
    </div>
  );
};

export default UserPrompt;
