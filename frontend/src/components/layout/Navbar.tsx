import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Wallet, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import AuthModal from '@/components/auth/AuthModal';
import ProfileSidebar from '@/components/layout/ProfileSidebar';

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthOpen(true);
  };

  const openSignup = () => {
    setAuthMode('signup');
    setIsAuthOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 glass-panel border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold hidden sm:block">Predex</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search prediction markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50 border-border focus:border-primary"
                />
              </div>
            </form>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              {isLoggedIn ? (
                <>
                  {/* Portfolio & Cash */}
                  <div className="hidden md:flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">Portfolio</p>
                      <p className="font-semibold">$0.00</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">Cash</p>
                      <p className="font-semibold text-success">$0.00</p>
                    </div>
                  </div>

                  <Button className="gradient-primary text-primary-foreground">
                    Deposit
                  </Button>

                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                  </Button>

                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <User className="w-5 h-5 text-primary-foreground" />
                  </button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={openLogin} className="hidden sm:inline-flex">
                    Log in
                  </Button>
                  <Button onClick={openSignup} className="gradient-primary text-primary-foreground">
                    Sign up
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hidden sm:inline-flex"
                    onClick={() => {
                      setIsLoggedIn(true);
                    }}
                  >
                    <Wallet className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
        onSuccess={() => {
          setIsLoggedIn(true);
          setIsAuthOpen(false);
        }}
      />

      <ProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={() => {
          setIsLoggedIn(false);
          setIsProfileOpen(false);
        }}
      />
    </>
  );
}
