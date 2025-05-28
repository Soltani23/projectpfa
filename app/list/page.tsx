import { Header } from '@/components/layout/header';
import { Shell } from '@/components/layout/shell';
import { ListNavigation } from '@/components/layout/list-navigation';

export default function ListPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Shell>
        <main className="flex-1 py-8">
          <ListNavigation />
        </main>
      </Shell>
    </div>
  );
}