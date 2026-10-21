import { AppHeader } from '@/components/app-header';
import { Sidebar, TabBar } from '@/components/nav';

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh lg:pl-64">
      <Sidebar />
      <AppHeader />
      <main
        id="main"
        className="mx-auto w-full max-w-[720px] px-4 pt-1 pb-[calc(76px+env(safe-area-inset-bottom))] lg:max-w-4xl lg:px-10 lg:pt-8 lg:pb-16"
      >
        {children}
      </main>
      <TabBar />
    </div>
  );
}
