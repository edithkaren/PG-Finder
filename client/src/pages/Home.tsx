import { useState } from "react";
import { useCities, usePgs } from "@/hooks/use-pgs";
import { Navbar } from "@/components/Navbar";
import { PgCard } from "@/components/PgCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, MapPin, Building2, ArrowRight, RefreshCw } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Home() {
  const [city, setCity] = useState("");
  const [_, setLocation] = useLocation();
  const { data: pgs, isLoading } = usePgs();
  const { data: cities, isLoading: citiesLoading } = useCities();

  const handleSearch = () => {
    if (city) {
      setLocation(`/pgs?city=${encodeURIComponent(city)}`);
    } else {
      setLocation('/pgs');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 px-4 mx-auto text-center space-y-8">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-[1.1]">
              Find your perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">home</span> away from home.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse hundreds of verified PGs with best-in-class amenities. reliable, safe, and affordable.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white dark:bg-card p-2 rounded-2xl shadow-xl shadow-black/5 border border-border/50 flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input 
                className="pl-10 h-12 border-0 bg-transparent focus-visible:ring-0 text-base placeholder:text-muted-foreground/70"
                placeholder="Enter city or locality..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="h-px md:h-12 w-full md:w-px bg-border mx-2" />
            <div className="w-full md:w-48">
              <Select defaultValue="all">
                <SelectTrigger className="h-12 border-0 bg-transparent focus:ring-0 text-base">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Gender</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              size="lg" 
              className="h-12 px-8 rounded-xl font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
              onClick={handleSearch}
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y bg-background py-14">
        <div className="container mx-auto px-4">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Live availability
              </div>
              <h2 className="mt-2 text-3xl font-display font-bold">Stays across every listed city</h2>
              <p className="mt-2 text-muted-foreground">
                Explore current properties by city. Availability syncs from the live listings database.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className="h-3.5 w-3.5" />
              Refreshes every 30 seconds
            </div>
          </div>

          {citiesLoading ? (
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="h-28 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {cities?.map((item) => (
                <button
                  key={item.city}
                  onClick={() => setLocation(`/pgs?city=${encodeURIComponent(item.city)}`)}
                  className="group rounded-2xl border border-border/70 bg-card p-4 text-left transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                >
                  <Building2 className="h-5 w-5 text-primary" />
                  <p className="mt-5 truncate font-display font-semibold">{item.city}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.count} {item.count === 1 ? "stay" : "stays"}
                    <ArrowRight className="ml-1 inline h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-secondary/30">
        <div className="container px-4 mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground">Featured Stays</h2>
              <p className="text-muted-foreground mt-2">Top rated PGs recommended for you</p>
            </div>
            <Link href="/pgs">
              <Button variant="outline" className="hidden md:flex">View All Listings</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pgs?.slice(0, 3).map((pg) => (
                <PgCard key={pg.id} pg={pg} />
              ))}
              {(!pgs || pgs.length === 0) && (
                <div className="col-span-full text-center py-20 bg-card rounded-2xl border border-dashed">
                  <p className="text-muted-foreground">No listings found. Be the first to add one!</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-10 text-center md:hidden">
            <Link href="/pgs">
              <Button variant="outline" className="w-full">View All Listings</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
