/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { motion } from 'motion/react';
import { Rocket, Github, Chrome as Google, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, user } = useAuth();
  const mode = searchParams.get('mode') || 'login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'talent' | 'recruiter'>('recruiter');

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === 'login') {
      login(email, 'recruiter');
      toast.success('Welcome back!');
    } else {
      register(name, email, 'recruiter');
      toast.success('Account created successfully!');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-zinc-50 px-4 py-12 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zinc-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 -z-0" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-zinc-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 -z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-zinc-200 shadow-xl shadow-zinc-200/50 rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 pb-8 text-center bg-white border-b border-zinc-100">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center">
                <Rocket className="text-white w-6 h-6" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription className="text-zinc-500">
              {mode === 'login' 
                ? 'Sign in to access your recruitment dashboard' 
                : 'Join as a recruiter to hire top global talent'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Button variant="outline" className="rounded-xl border-zinc-200 font-medium py-6">
                <Google className="w-4 h-4 mr-2" /> Google
              </Button>
              <Button variant="outline" className="rounded-xl border-zinc-200 font-medium py-6">
                <Github className="w-4 h-4 mr-2" /> GitHub
              </Button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-100"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-zinc-400 font-medium">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-zinc-700">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border-zinc-200 h-11 focus-visible:ring-zinc-900" 
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-zinc-700">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-zinc-200 h-11 focus-visible:ring-zinc-900" 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" name="password" className="text-sm font-semibold text-zinc-700">Password</Label>
                  {mode === 'login' && (
                    <button type="button" className="text-xs font-semibold text-zinc-400 hover:text-zinc-900">Forgot password?</button>
                  )}
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-zinc-200 h-11 focus-visible:ring-zinc-900" 
                />
              </div>
              <Button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl h-11 font-bold text-base mt-2">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pb-8 pt-2">
            <p className="text-sm text-zinc-500 font-medium">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => navigate(`/?mode=${mode === 'login' ? 'register' : 'login'}`)}
                className="text-zinc-900 font-bold hover:underline underline-offset-4"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
