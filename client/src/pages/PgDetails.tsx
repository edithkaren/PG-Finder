import { useParams, Link } from "wouter";
import { usePg } from "@/hooks/use-pgs";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { 
  MapPin, Wifi, Phone, ShieldCheck, Info, Loader2, 
  ArrowLeft, Share2, Heart, CheckCircle2 
} from "lucide-react";

export default function PgDetails() {
  const { id } = useParams();
  const { data: pg, isLoading } = usePg(Number(id));
  const { isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-2xl font-bold mb-2">PG Not Found</h1>
          <p className="text-muted-foreground mb-6">The property you are looking for does not exist.</p>
          <Link href="/pgs">
            <Button>Browse All Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Use Unsplash placeholders for gallery
  const images = pg.images.length > 0 ? pg.images : [
    "https://images.unsplash.com/photo-1522771753035-1a5b65a9f176?w=1200",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb / Back */}
        <div className="mb-6">
          <Link href="/pgs" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Search
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Gallery & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">{pg.name}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {pg.city}
                </Badge>
                <Badge variant={pg.gender === 'male' ? 'secondary' : pg.gender === 'female' ? 'default' : 'outline'}>
                  {pg.gender === 'male' ? 'Men Only' : pg.gender === 'female' ? 'Women Only' : 'Unisex'}
                </Badge>
              </div>
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] md:h-[500px]">
              <div className="md:col-span-2 h-full rounded-2xl overflow-hidden shadow-sm">
                 {/* Main Image */}
                <img src={images[0]} alt="Main View" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="font-display font-semibold text-xl">About this PG</h3>
              <p className="text-muted-foreground leading-relaxed">{pg.description}</p>
            </div>
            
            <Separator />

            {/* Amenities */}
            <div>
              <h3 className="font-display font-semibold text-xl mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pg.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-secondary">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-24 shadow-xl shadow-black/5 border-border/50">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">Rent starts at</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">₹{pg.price.toLocaleString()}</span>
                  <span className="text-muted-foreground">/ month</span>
                </div>
              </div>

              <div className="space-y-4">
                {isAuthenticated ? (
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25" onClick={() => alert('Contacting owner...')}>
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Owner
                  </Button>
                ) : (
                  <Button size="lg" variant="outline" className="w-full" onClick={() => window.location.href = "/api/login"}>
                    Login to Contact
                  </Button>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-3">
                 <div className="flex items-start gap-3">
                   <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
                   <div>
                     <p className="font-semibold text-sm">Verified Property</p>
                     <p className="text-xs text-muted-foreground">Inspected for quality and safety standards.</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                   <div>
                     <p className="font-semibold text-sm">No Brokerage</p>
                     <p className="text-xs text-muted-foreground">Connect directly with the owner.</p>
                   </div>
                 </div>
              </div>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
