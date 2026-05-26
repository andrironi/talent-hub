/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from './components/ui/button';
import { User, LogOut, Menu, X, Rocket, LayoutDashboard, Settings, Bell } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Rocket className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight">TalentHub</span>
              </Link>

              {/* Desktop Main Links */}
              <div className="hidden md:flex items-center gap-6 ml-4">
                <Link to="/" className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">Talent Search</Link>
                <Link to="/" className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">Jobs</Link>
                <Link to="/" className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">Companies</Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-900">
                    <Bell className="w-5 h-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-3 pl-2 group outline-none">
                      <div className="text-right hidden xl:block">
                        <p className="text-sm font-bold text-zinc-900 leading-none mb-1">{user.name}</p>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{user.role}</p>
                      </div>
                      <Avatar className="w-9 h-9 border-2 border-transparent group-hover:border-zinc-100 transition-all">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl border-zinc-100">
                      <DropdownMenuLabel className="font-bold text-zinc-900">My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-zinc-100" />
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="rounded-xl p-2.5 cursor-pointer font-medium focus:bg-zinc-50">
                        <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl p-2.5 cursor-pointer font-medium focus:bg-zinc-50">
                        <Settings className="w-4 h-4 mr-2" /> Profile Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-100" />
                      <DropdownMenuItem onClick={handleLogout} className="rounded-xl p-2.5 cursor-pointer font-bold text-red-600 focus:bg-red-50 focus:text-red-600">
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/?mode=login">
                    <Button variant="ghost" className="text-sm font-bold text-zinc-600 px-5">Login</Button>
                  </Link>
                  <Link to="/?mode=register">
                    <Button className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-6 font-bold shadow-lg shadow-zinc-900/10">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-zinc-100 bg-white"
            >
              <div className="px-4 pt-2 pb-6 space-y-4">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium text-zinc-600">Talent Search</Link>
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium text-zinc-600">Jobs</Link>
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium text-zinc-600">Companies</Link>
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium text-zinc-600">Dashboard</Link>
                    <button onClick={handleLogout} className="block text-base font-medium text-red-600">Logout</button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 pt-2">
                    <Link to="/?mode=login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Sign in</Button>
                    </Link>
                    <Link to="/?mode=register" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-zinc-900 text-white">Join Now</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="bg-zinc-50 border-t border-zinc-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-zinc-900 rounded flex items-center justify-center">
              <Rocket className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold">TalentHub</span>
          </div>
          <p className="text-sm text-zinc-500">© 2024 TalentHub. Connecting global talent with the next big thing.</p>
        </div>
      </footer>
    </div>
  );
}
