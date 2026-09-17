import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import {
  TrendingUp, TrendingDown, Leaf, Calendar, AlertCircle, Users, Cloud,
  Droplets, Wind, MapPin, Ruler, CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import { useTranslation } from '../i18n';

interface DashboardProps {
  user: any;
}

const FALLBACK_CITIES = [
  { name: 'New Delhi', lat: 28.6139, lon: 77.209 },
  { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567 },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
];

export function Dashboard({ user }: DashboardProps) {
  const { t } = useTranslation();
  const [weather, setWeather] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [needsManualLocation, setNeedsManualLocation] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [prices, setPrices] = useState<any[]>([]);

  const fetchWeather = async (lat: number, lon: number) => {
    setLoadingWeather(true);
    setWeatherError(null);
    try {
      const response = await api.get('/weather/current', { params: { lat, lon } });
      setWeather(response.data);
      setNeedsManualLocation(false);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      setWeatherError(t('dash.weatherFail'));
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    api.get('/stats/dashboard').then((r) => setStats(r.data)).catch(() => setStats(null));
    api.get('/market/prices')
      .then((r) => setPrices((r.data.prices || []).filter((p: any) => !p.unavailable).slice(0, 4)))
      .catch(() => setPrices([]));
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setNeedsManualLocation(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
      (error) => {
        console.error('Geolocation error:', error);
        setNeedsManualLocation(true);
      }
    );
  }, []);

  const userName = user?.name || user?.email?.split('@')[0] || 'Farmer';
  const locationText = user?.location || t('dash.noLocation');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-900">{t('dash.welcome')}, {userName}! 🌾</h1>
          <p className="text-green-700 mt-1 flex items-center gap-2">
            <MapPin className="h-4 w-4" /> {locationText}
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

        {loadingWeather && !weather && (
          <div className="bg-white p-4 rounded-xl shadow-sm border text-sm text-gray-500">
            {t('dash.weatherLoading')}
          </div>
        )}

        {!weather && !loadingWeather && (needsManualLocation || weatherError) && (
          <div className="bg-white p-4 rounded-xl shadow-sm border max-w-sm">
            <p className="text-sm text-gray-600 mb-2">{weatherError || t('dash.weatherPick')}</p>
            <div className="flex flex-wrap gap-2">
              {FALLBACK_CITIES.map((city) => (
                <button
                  key={city.name}
                  onClick={() => fetchWeather(city.lat, city.lon)}
                  className="text-xs px-3 py-1.5 bg-green-50 text-green-800 rounded-full hover:bg-green-100 transition-colors"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">{t('dash.activeCrops')}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-900">{stats?.activeCrops.count ?? '—'}</div>
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats?.activeCrops.names?.length ? stats.activeCrops.names.join(', ') : t('dash.noCrops')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">{t('common.acres')}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-900">{stats?.land.totalAcres ?? '—'}</div>
              <Ruler className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">{t('dash.upcomingTasksSub')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">{t('dash.tasksWeek')}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-orange-900">{stats?.tasks.dueThisWeek ?? '—'}</div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats ? `${stats.tasks.pendingTotal} ${t('dash.pending')}` : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">{t('dash.community')}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-blue-900">{stats?.community.farmers ?? '—'}</div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">{t('dash.farmersConnected')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('dash.upcomingTasks')}</CardTitle>
            <CardDescription>{t('dash.upcomingTasksSub')}</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.tasks.upcoming?.length ? (
              <div className="space-y-4">
                {stats.tasks.upcoming.map((task: any) => (
                  <div key={task.taskId} className="flex items-start gap-3 p-3 rounded-lg bg-green-50">
                    <div className={`w-2 h-2 rounded-full mt-2 ${task.daysUntil < 0 ? 'bg-red-500' : 'bg-green-600'}`} />
                    <div className="flex-1">
                      <p className="font-medium text-green-900">{task.task} — {task.crop}</p>
                      <p className="text-sm opacity-80">{task.description}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {task.daysUntil < 0
                          ? `${Math.abs(task.daysUntil)} ${t('dash.days')} overdue`
                          : `${t('dash.dueIn')} ${task.daysUntil} ${t('dash.days')}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-start gap-2 text-sm text-gray-500 py-6">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{t('dash.noTasks')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>{t('dash.marketInsights')}</CardTitle>
              <CardDescription>{t('dash.marketSub')}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prices.map((p: any) => (
                <div key={p.crop} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{p.crop}</p>
                    <p className="text-sm text-gray-600">₹{p.avgModalPrice.toLocaleString()} / {t('market.perQuintalShort')}</p>
                  </div>
                  <div className={`flex items-center ${p.trend === 'up' ? 'text-green-600' : p.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                    {p.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : p.trend === 'down' ? <TrendingDown className="h-4 w-4 mr-1" /> : null}
                    <span className="text-sm font-medium">
                      {p.change !== null ? `${p.change > 0 ? '+' : ''}${p.change}%` : '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-l-4 border-l-amber-500">
        <CardHeader><CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-amber-600" /> {t('dash.quickTips')}</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-700">
            <TipItem tip="Check leaf undersides weekly — most pest and disease problems show there first." />
            <TipItem tip="Water at the base of plants early in the day to limit fungal spread." />
            <TipItem tip="Keep a field diary of sowing, spraying and harvest dates for next season." />
          </ul>
        </CardContent>
      </Card>
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
