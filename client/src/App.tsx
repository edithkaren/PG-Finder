import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/Home";
import Listings from "@/pages/Listings";
import PgDetails from "@/pages/PgDetails";
import ListProperty from "@/pages/ListProperty";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import { Footer } from "@/components/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/pgs" component={Listings} />
      <Route path="/pgs/:id" component={PgDetails} />
      <Route path="/list-property" component={ListProperty} />
      <Route path="/login" component={Login} />
      
      {/* Route for "My Listings" redirects to listings page for prototype */}
      <Route path="/my-listings" component={Listings} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">
            <Router />
          </div>
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
