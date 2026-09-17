import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { CropRecommendation } from './components/CropRecommendation';
import { CropRoadmap } from './components/CropRoadmap';
import { DiseaseDetection } from './components/DiseaseDetection';
import { FarmFeed } from './components/FarmFeed';
import { MarketAnalytics } from './components/MarketAnalytics';
import { Chatbot } from './components/Chatbot';
import { Button } from './components/ui/button';
import api from './services/api';
import {
  Sprout,
  LayoutDashboard,
  Leaf,
  Calendar,
  Microscope,
  Users,
  TrendingUp,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Toaster } from './components/ui/sonner';

type View = 'dashboard' | 'crop-recommendation' | 'crop-roadmap' | 'disease-detection' | 'farm-feed' | 'market-analytics';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Sync with backend on refresh
          const response = await api.post('/users/sync');
          setUser(response.data);
        } catch (err) {
          console.error('Initial sync error:', err);
          // Still set user from firebase if backend fails (graceful degradation)
          setUser({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          });
        }
        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (syncedUser: any) => {
    setUser(syncedUser);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setCurrentView('dashboard');
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crop-recommendation', label: 'Crop Advisor', icon: Leaf },
    { id: 'crop-roadmap', label: 'Crop Roadmap', icon: Calendar },
    { id: 'disease-detection', label: 'Disease Detection', icon: Microscope },
    { id: 'farm-feed', label: 'FarmFeed', icon: Users },
    { id: 'market-analytics', label: 'Market Analytics', icon: TrendingUp },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-4 animate-pulse">
            <Sprout className="w-8 h-8" />
          </div>
          <p className="text-green-700">Loading AgroLyft...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-900">AgroLyft</h1>
                <p className="text-xs text-green-700 hidden sm:block">Smart Farming, Elevated Growth</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user.photoURL && (
              <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-full border hidden sm:block" />
            )}
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-65px)] sticky top-[65px]">
          <nav className="p-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as View)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === item.id
                    ? 'bg-green-100 text-green-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[65px] bg-white z-30 overflow-y-auto">
            <nav className="p-4 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id as View);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === item.id
                      ? 'bg-green-100 text-green-900 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && <Dashboard user={user} />}
            {currentView === 'crop-recommendation' && <CropRecommendation />}
            {currentView === 'crop-roadmap' && <CropRoadmap />}
            {currentView === 'disease-detection' && <DiseaseDetection />}
            {currentView === 'farm-feed' && <FarmFeed user={user} />}
            {currentView === 'market-analytics' && <MarketAnalytics />}
          </div>
        </main>
      </div>
      
      {/* Global Chatbot */}
      <Chatbot />
    </div>
  );
}
