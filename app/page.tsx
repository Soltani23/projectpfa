import { Header } from '@/components/layout/header';
import { Shell } from '@/components/layout/shell';
import { TabNavigation } from '@/components/layout/tab-navigation';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Shell>
        <main className="flex-1 py-8">
          <TabNavigation />
        </main>
      </Shell>
    </div>
  );
}