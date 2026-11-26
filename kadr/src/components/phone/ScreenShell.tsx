import React, { ReactNode } from 'react';
import { TelegramBar } from './TelegramBar';

type ScreenShellProps = {
  children: ReactNode;
  footer?: ReactNode;
};

export function ScreenShell({ children, footer }: ScreenShellProps) {
  return (
    <div className="flex h-full flex-col">
      <TelegramBar />
      <main className="no-scrollbar relative flex-1 overflow-y-auto">
        {children}
        <div className="h-6" />
      </main>
      {footer}
    </div>
  );
}

export function StickyFooter({ children }: { children: ReactNode }) {
  return (
    <div className="shrink-0 border-t border-line bg-white/95 px-5 pb-8 pt-3 backdrop-blur">
      {children}
    </div>
  );
}
