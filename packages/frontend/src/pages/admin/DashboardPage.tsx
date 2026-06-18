import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Calendar, Megaphone, Users } from 'lucide-react';

interface Stats {
  sermons: number;
  events: number;
  announcements: number;
  teamMembers: number;
}

export function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => apiRequest<Stats>('/stats'),
  });

  const statCards = [
    { label: 'Sermons', value: stats?.sermons || 0, icon: Video, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Events', value: stats?.events || 0, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Announcements', value: stats?.announcements || 0, icon: Megaphone, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Team Members', value: stats?.teamMembers || 0, icon: Users, color: 'text-crimson', bg: 'bg-crimson-50' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your church website content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.label}
                </CardTitle>
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-gray-200 shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-xl font-serif">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a href="/admin/sermons" className="block text-crimson hover:underline">+ Add New Sermon</a>
            <a href="/admin/events" className="block text-crimson hover:underline">+ Add New Event</a>
            <a href="/admin/announcements" className="block text-crimson hover:underline">+ Create Announcement</a>
            <a href="/admin/team" className="block text-crimson hover:underline">+ Add Team Member</a>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-serif">Content Sections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <p>• Home Hero</p>
            <p>• About Page</p>
            <p>• Contact Info</p>
            <p>• Sermon Settings</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-serif">System Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Last Updated:</strong> Today</p>
            <p><strong>Status:</strong> <span className="text-green-600">● Online</span></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
