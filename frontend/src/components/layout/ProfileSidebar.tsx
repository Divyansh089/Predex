import { Link } from 'react-router-dom';
import { X, User, Trophy, Gift, Code, Moon, Sun, LogOut, Settings, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileSidebar({ isOpen, onClose, onLogout }: ProfileSidebarProps) {
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-80 bg-card border-l border-border z-50 shadow-2xl",
        "animate-slide-in-right"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">predexUser01</h3>
                <p className="text-xs text-muted-foreground font-mono">0xF59F...1be3</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 py-2 overflow-y-auto">
            <Link to="/profile" onClick={onClose} className="sidebar-item">
              <User className="w-5 h-5 text-muted-foreground" />
              <span>Portfolio</span>
              <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
            </Link>

            <Link to="/leaderboard" onClick={onClose} className="sidebar-item">
              <Trophy className="w-5 h-5 text-muted-foreground" />
              <span>Leaderboard</span>
              <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
            </Link>

            <Link to="/rewards" onClick={onClose} className="sidebar-item">
              <Gift className="w-5 h-5 text-muted-foreground" />
              <span>Rewards</span>
              <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
            </Link>

            <div className="my-2 border-t border-border" />

            <Link to="/api" onClick={onClose} className="sidebar-item">
              <Code className="w-5 h-5 text-muted-foreground" />
              <span>APIs</span>
              <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
            </Link>

            <Link to="/builders" onClick={onClose} className="sidebar-item">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span>Builders</span>
              <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
            </Link>

            <div className="my-2 border-t border-border" />

            {/* Theme Toggle */}
            <div className="sidebar-item">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground" />
              )}
              <span>Dark mode</span>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                className="ml-auto"
              />
            </div>

            <div className="my-2 border-t border-border" />

            <div className="px-4 py-2 space-y-1">
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground py-1">
                Accuracy
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground py-1">
                Support
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground py-1">
                Documentation
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground py-1">
                Terms of Use
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
