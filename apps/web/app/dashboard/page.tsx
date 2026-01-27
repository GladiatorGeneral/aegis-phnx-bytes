import { ProjectDashboard } from '@/components/dashboard/ProjectDashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <ProjectDashboard projectId="PROJ-2026-001" />
    </div>
  );
}
