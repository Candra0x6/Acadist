import SidebarChat from '@/components/editor/elements/ai-chat/SidebarChat';
import { AppSidebar } from '@/components/elements/Sidebar';
import {
  MultiSidebarProvider,
  SidebarInset,
} from '@/components/ui/multisidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MultiSidebarProvider>
      <AppSidebar />

      <main className="flex max-h-screen overflow-hidden w-full pt-5">
        {children}
        {/* <SidebarInset>{children}</SidebarInset> */}
      </main>
      <SidebarChat />
    </MultiSidebarProvider>
  );
}
