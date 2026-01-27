import { useState } from 'react';
import { X, Mail, Lock, User, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    onSuccess();
  };

  const handleWalletConnect = async () => {
    setIsLoading(true);
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onSuccess();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className={cn(
            "w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl",
            "animate-scale-in"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Web3 Wallet Options */}
            <div className="space-y-3 mb-6">
              <Button
                variant="outline"
                className="w-full h-12 justify-start gap-3"
                onClick={handleWalletConnect}
                disabled={isLoading}
              >
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span>MetaMask</span>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 justify-start gap-3"
                onClick={handleWalletConnect}
                disabled={isLoading}
              >
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <span>WalletConnect</span>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 justify-start gap-3"
                onClick={handleWalletConnect}
                disabled={isLoading}
              >
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span>Coinbase Wallet</span>
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
              </Button>
            </form>

            {/* Toggle Mode */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => onModeChange('signup')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => onModeChange('login')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
