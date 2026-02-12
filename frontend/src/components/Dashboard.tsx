import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { TrendingUp, TrendingDown, Leaf, Calendar, AlertCircle, Users, Cloud, Thermometer, Droplets, Wind } from 'lucide-react';
import api from '../services/api';

interface DashboardProps {
  user: any;
}

export function Dashboard({ user }: DashboardProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      setLoadingWeather(true);
      try {
        const response = await api.get('/weather/current', { params: { lat, lon } });
        setWeather(response.data);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setLoadingWeather(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Default to a location or show placeholder
        }
      );
    }
  }, []);

  const userName = user?.name || user?.email?.split('@')[0] || 'Farmer';
  const locationText = user?.location || 'Location not set';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-900">Welcome back, {userName}! 🌾</h1>
          <p className="text-green-700 mt-1 flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" /> {locationText}
          </p>
        </div>

        {weather && (
          <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Cloud className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(weather.current.main.temp)}°C</p>
              <p className="text-sm text-gray-500 capitalize">{weather.current.weather[0].description}</p>
            </div>
            <div className="border-l pl-4 flex flex-col gap-1">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Droplets className="h-3 w-3" /> {weather.current.main.humidity}%
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Wind className="h-3 w-3" /> {weather.current.wind.speed} m/s
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Active Crops</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between"><div className="text-3xl font-bold text-green-900">3</div><Leaf className="h-8 w-8 text-green-600" /></div>
            <p className="text-xs text-gray-500 mt-2">Rice, Wheat, Tomato</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Expected Profit</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between"><div className="text-3xl font-bold text-green-900">₹1.2L</div><TrendingUp className="h-8 w-8 text-green-600" /></div>
            <p className="text-xs text-green-600 mt-2 flex items-center"><TrendingUp className="h-3 w-3 mr-1" /> +12.5% from last season</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Tasks This Week</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between"><div className="text-3xl font-bold text-orange-900">5</div><Calendar className="h-8 w-8 text-orange-600" /></div>
            <p className="text-xs text-gray-500 mt-2">2 pending, 3 upcoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Community</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between"><div className="text-3xl font-bold text-blue-900">127</div><Users className="h-8 w-8 text-blue-600" /></div>
            <p className="text-xs text-gray-500 mt-2">Farmers connected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Stay on track with your crop roadmap</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <TaskItem color="green" title="Fertilizer Application - Rice" desc="Apply urea 25kg/acre" due="2 days" />
              <TaskItem color="blue" title="Irrigation - Wheat" desc="Light irrigation required" due="4 days" />
              <TaskItem color="purple" title="Staking - Tomato" desc="Provide bamboo stakes" due="5 days" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
            <CardDescription>Current crop prices in your region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <MarketItem name="Rice" price="₹2,100/q" change="+5.2%" up />
              <MarketItem name="Wheat" price="₹2,050/q" change="+3.1%" up />
              <MarketItem name="Tomato" price="₹1,200/q" change="+12.5%" up />
              <MarketItem name="Cotton" price="₹5,800/q" change="-2.3%" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-l-4 border-l-amber-500">
        <CardHeader><CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-amber-600" /> Quick Tips</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-700">
            <TipItem tip="Monitor weather forecasts daily - heavy rain expected this week" />
            <TipItem tip="Early blight season is approaching - inspect tomato plants regularly" />
            <TipItem tip="Rice market prices are rising - consider holding stock for better rates" />
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return <path className={className} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />;
}

function TaskItem({ color, title, desc, due }: any) {
  const colorMap: any = {
    green: 'bg-green-50 text-green-900 border-green-600',
    blue: 'bg-blue-50 text-blue-900 border-blue-600',
    purple: 'bg-purple-50 text-purple-900 border-purple-600',
  };
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${colorMap[color].split(' ')[0]}`}>
      <div className={`w-2 h-2 rounded-full mt-2 ${colorMap[color].split(' ')[2].replace('border-', 'bg-')}`}></div>
      <div className="flex-1">
        <p className={`font-medium ${colorMap[color].split(' ')[1]}`}>{title}</p>
        <p className="text-sm opacity-80">{desc}</p>
        <p className="text-xs mt-1 opacity-70">Due in {due}</p>
      </div>
    </div>
  );
}

function MarketItem({ name, price, change, up }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div><p className="font-medium text-gray-900">{name}</p><p className="text-sm text-gray-600">{price}</p></div>
      <div className={`flex items-center ${up ? 'text-green-600' : 'text-red-600'}`}>
        {up ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
        <span className="text-sm font-medium">{change}</span>
      </div>
    </div>
  );
}

function TipItem({ tip }: { tip: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className="text-amber-600 mt-1">•</span>
      <span>{tip}</span>
    </li>
  );
}
