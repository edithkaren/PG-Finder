import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, LogOut, Plus, User as UserIcon, Menu } from "lucide-react";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Home className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            PG<span className="text-primary">Finder</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/pgs" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/pgs' ? 'text-primary' : 'text-muted-foreground'}`}>
            Browse Listings
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link href="/list-property">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                  <Plus className="w-4 h-4 mr-2" />
                  List Property
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.profileImageUrl ?? undefined} alt={user?.firstName || 'User'} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.firstName?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.firstName && (
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                      )}
                      {user?.email && (
                        <p className="w-[200px] truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-listings" className="cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      <span>My Listings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => window.location.href = "/login"}>
                Log in
              </Button>
              <Button onClick={() => window.location.href = "/login"} className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20">
                Sign up
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger - Simplified for prototype */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
