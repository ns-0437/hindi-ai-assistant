import React from 'react';
import type { Message } from '../types';
import { UserIcon, AiBrainIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 md:gap-4 ${isUser ? 'justify-end' : ''} animate-fade-in-up`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
          <AiBrainIcon className="w-5 h-5 md:w-6 md:h-6 text-brand-violet" />
        </div>
      )}
      <div
        className={`max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl shadow-lg text-slate-100 ${
          isUser
            ? 'bg-gradient-to-br from-brand-blue to-brand-violet rounded-br-none'
            : 'bg-slate-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm md:text-base whitespace-pre-wrap">{message.text}</p>
      </div>
       {isUser && (
        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
          <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-slate-300" />
        </div>
      )}
    </div>
  );
};

