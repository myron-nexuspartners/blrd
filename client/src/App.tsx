import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import News from "./pages/News";
import Discover from "./pages/Discover";
import Reviews from "./pages/Reviews";
import Events from "./pages/Events";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
// Admin pages
import AdminOverview from "./pages/admin/AdminOverview";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminAuthors from "./pages/admin/AdminAuthors";
import AdminPipeline from "./pages/admin/AdminPipeline";
// Author pages
import { AuthorsPage, AuthorProfilePage } from "./pages/Authors";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/news" component={News} />
      <Route path="/discover" component={Discover} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/events" component={Events} />
      <Route path="/blog" component={Blog} />
      <Route path="/contact" component={Contact} />
      {/* Admin routes — role guard is inside AdminLayout */}
      <Route path="/admin" component={AdminOverview} />
      <Route path="/admin/blog" component={AdminBlog} />
      <Route path="/admin/reviews" component={AdminReviews} />
      <Route path="/admin/events" component={AdminEvents} />
      <Route path="/admin/contacts" component={AdminContacts} />
      <Route path="/admin/authors" component={AdminAuthors} />
      <Route path="/admin/pipeline" component={AdminPipeline} />
      {/* Author pages */}
      <Route path="/authors" component={AuthorsPage} />
      <Route path="/authors/:slug" component={AuthorProfilePage} />
      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
