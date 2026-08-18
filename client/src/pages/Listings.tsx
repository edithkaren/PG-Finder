import { useState } from "react";
import { usePgs } from "@/hooks/use-pgs";
import { Navbar } from "@/components/Navbar";
import { PgCard } from "@/components/PgCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Loader2, SlidersHorizontal, Search } from "lucide-react";

export default function Listings() {
  const [cityFilter, setCityFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data: pgs, isLoading } = usePgs({
    city: cityFilter || undefined,
    gender: genderFilter !== "all" ? genderFilter : undefined,
    search: search || undefined,
  });

  const FilterPanel = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-display font-semibold mb-4 text-lg">Location</h3>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="City or Area..." 
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      <Separator />

      <div>
        <h3 className="font-display font-semibold mb-4 text-lg">Gender</h3>
        <RadioGroup value={genderFilter} onValueChange={setGenderFilter}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="r-all" />
            <Label htmlFor="r-all">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="r-male" />
            <Label htmlFor="r-male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="r-female" />
            <Label htmlFor="r-female">Female</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unisex" id="r-unisex" />
            <Label htmlFor="r-unisex">Unisex</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <Button 
        className="w-full" variant="outline"
        onClick={() => { setCityFilter(""); setGenderFilter("all"); setSearch(""); }}
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      
      <div className="container px-4 mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block w-64 shrink-0 space-y-8 sticky top-24 h-fit">
            <FilterPanel />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-display font-bold">
                {pgs?.length ?? 0} Properties Found
              </h1>
              
              {/* Mobile Filter Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="mt-6">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {pgs?.map((pg) => (
                  <PgCard key={pg.id} pg={pg} />
                ))}
                
                {pgs?.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-muted/30 rounded-2xl border border-dashed">
                    <p className="text-lg text-muted-foreground font-medium">No PGs found matching your criteria.</p>
                    <Button 
                      variant="ghost"
                      onClick={() => { setCityFilter(""); setGenderFilter("all"); }}
                      className="text-primary mt-2"
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
