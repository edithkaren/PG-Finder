import { Link } from "wouter";
import { type Pg } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Wifi, CheckCircle2, Star } from "lucide-react";

interface PgCardProps {
  pg: Pg;
}

export function PgCard({ pg }: PgCardProps) {
  // Use first image or fallback
  const displayImage = pg.images?.[0] || "https://images.unsplash.com/photo-1522771753035-1a5b65a9f176?w=800&auto=format&fit=crop&q=60";

  return (
    <Card className="group overflow-hidden border-border/50 bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-foreground font-semibold shadow-sm">
            {pg.gender === 'male' ? 'Men Only' : pg.gender === 'female' ? 'Women Only' : 'Unisex'}
          </Badge>
        </div>
        
        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 z-10">
          <div className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold shadow-lg backdrop-blur-sm">
            ₹{pg.price.toLocaleString()}<span className="text-xs font-normal opacity-90">/mo</span>
          </div>
        </div>

        {/* Unsplash Image with fallback comment */}
        {/* modern apartment interior */}
        <img 
          src={displayImage} 
          alt={pg.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-display font-bold text-xl text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {pg.name}
          </h3>
          <div className="flex items-center gap-1 mt-1.5 text-muted-foreground text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{pg.city}, {pg.address}</span>
          </div>
        </div>

        {/* Amenities Preview */}
        <div className="flex flex-wrap gap-2">
          {pg.amenities.slice(0, 3).map((amenity, i) => (
            <div key={i} className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
              <CheckCircle2 className="w-3 h-3 text-primary" />
              {amenity}
            </div>
          ))}
          {pg.amenities.length > 3 && (
            <span className="text-xs text-muted-foreground py-1 px-1">+{pg.amenities.length - 3} more</span>
          )}
        </div>

        <Link href={`/pgs/${pg.id}`} className="block">
          <Button className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-white transition-all duration-300 font-semibold shadow-sm">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
}
