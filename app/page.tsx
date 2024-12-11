import { DashboardTabs } from '@/components/dashboard-tabs';

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Periodic Double Auction Market</h1>
          <p className="text-lg text-muted-foreground">
            A decentralized energy trading platform
          </p>
        </header>
        <DashboardTabs />
      </div>
    </main>
  );
}