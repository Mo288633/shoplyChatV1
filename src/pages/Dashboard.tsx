import React from 'react';
import { Layout } from '../app/layout';
import { SidebarDemo } from '../components/dashboard/sidebar-demo';

interface DashboardPageProps {
  onNavigateHome: () => void;
}

export default function DashboardPage({ onNavigateHome }: DashboardPageProps) {
  return (
    <Layout showNavigation={false} showFooter={false}>
      <div className="h-screen">
        <SidebarDemo onNavigateHome={onNavigateHome} />
      </div>
    </Layout>
  );
}