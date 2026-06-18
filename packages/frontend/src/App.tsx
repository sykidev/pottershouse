import { Route, Switch, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { AdminLayout } from '@/components/AdminLayout';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { SermonsPage } from '@/pages/SermonsPage';
import { EventsPage } from '@/pages/EventsPage';
import { VisitPage } from '@/pages/VisitPage';
import { MinistriesPage } from '@/pages/MinistriesPage';
import { MinistryDetailPage } from '@/pages/MinistryDetailPage';
import { GivePage } from '@/pages/GivePage';
import { GalleryPage } from '@/pages/GalleryPage';
import { EventDetailPage } from '@/pages/EventDetailPage';
import { LoginPage } from '@/pages/admin/LoginPage';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { AdminSermonsPage } from '@/pages/admin/SermonsPage';
import { AdminEventsPage } from '@/pages/admin/EventsPage';
import { AdminAnnouncementsPage } from '@/pages/admin/AnnouncementsPage';
import { AdminTeamPage } from '@/pages/admin/TeamPage';
import { AdminContentPage } from '@/pages/admin/ContentPage';
import { AdminAboutCardsPage } from '@/pages/admin/AboutCardsPage';
import { AdminFooterPage } from '@/pages/admin/FooterPage';
import { AdminVisitPage } from '@/pages/admin/VisitPage';
import { AdminMinistriesPage } from '@/pages/admin/MinistriesPage';
import { AdminGivePage } from '@/pages/admin/GivePage';
import { AdminGalleryPage } from '@/pages/admin/GalleryPage';

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/admin/login" />;
  }

  return (
    <AdminLayout>
      <Component />
    </AdminLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          <Route path="/admin/login" component={LoginPage} />
          <Route path="/admin">
            <ProtectedRoute component={DashboardPage} />
          </Route>
          <Route path="/admin/sermons">
            <ProtectedRoute component={AdminSermonsPage} />
          </Route>
          <Route path="/admin/events">
            <ProtectedRoute component={AdminEventsPage} />
          </Route>
          <Route path="/admin/announcements">
            <ProtectedRoute component={AdminAnnouncementsPage} />
          </Route>
          <Route path="/admin/team">
            <ProtectedRoute component={AdminTeamPage} />
          </Route>
          <Route path="/admin/content">
            <ProtectedRoute component={AdminContentPage} />
          </Route>
          <Route path="/admin/about-cards">
            <ProtectedRoute component={AdminAboutCardsPage} />
          </Route>
          <Route path="/admin/footer">
            <ProtectedRoute component={AdminFooterPage} />
          </Route>
          <Route path="/admin/visit">
            <ProtectedRoute component={AdminVisitPage} />
          </Route>
          <Route path="/admin/ministries">
            <ProtectedRoute component={AdminMinistriesPage} />
          </Route>
          <Route path="/admin/give">
            <ProtectedRoute component={AdminGivePage} />
          </Route>
          <Route path="/admin/gallery">
            <ProtectedRoute component={AdminGalleryPage} />
          </Route>
          <Route>
            <div className="min-h-screen bg-warm-white">
              <Navbar />
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/about" component={AboutPage} />
                <Route path="/sermons" component={SermonsPage} />
                <Route path="/events" component={EventsPage} />
                <Route path="/events/:id" component={EventDetailPage} />
                <Route path="/visit" component={VisitPage} />
                <Route path="/ministries" component={MinistriesPage} />
                <Route path="/ministries/:slug" component={MinistryDetailPage} />
                <Route path="/gallery" component={GalleryPage} />
                <Route path="/connect">
                  <Redirect to="/ministries" />
                </Route>
                <Route path="/give" component={GivePage} />
                <Route>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
                  </div>
                </Route>
              </Switch>
              <Footer />
              <ScrollToTop />
            </div>
          </Route>
        </Switch>
      </AuthProvider>
    </QueryClientProvider>
  );
}
