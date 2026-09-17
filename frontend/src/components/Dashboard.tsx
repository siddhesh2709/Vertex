import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Leaf, Calendar, CheckCircle2, Circle, MapPin, RefreshCw, Loader2, Cloud, Droplets, Wind } from 'lucide-react';
import api from '../services/api';
import { useTranslation } from '../i18n';

interface DashboardProps {
  user: any;
}

interface Summary {
  generatedAt: string;
  profile: { name?: string; location?: string; soilType?: string; farmSize?: number } | null;
  stats: {
    cultivationPlans: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    dueNext7Days: number;
    progressPercent: number;
  };
  nextTasks: Array<{
    id: string;
    cultivationId: string;
    title: string;
    cropName: string;
    description: string;
    dueDate: string;
    daysUntilDue: number;
  }>;
  recentPlans: Array<{
    id: string;
    cropName: string;
    areaAcres: number;
    startDate: string;
    totalTasks: number;
    completedTasks: number;
    progressPercent: number;
  }>;
}

function localCalendarDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function displayDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'
  });
}

function dueLabel(days: number) {
  if (days < 0) return `${Math.abs(days)} day${days === -1 ? '' : 's'} overdue`;
  if (days === 0) return t('dash.dueToday');
  return `Due in ${days} day${days === 1 ? '' : 's'}`;
}

export function Dashboard({ user }: DashboardProps) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [weather, setWeather] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState('');

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setLoading(true);
    setError('');

    api.get('/dashboard/summary', {
      params: { today: localCalendarDate() },
      timeout: 15000,
      signal: controller.signal
    }).then(response => {
      if (active) setSummary(response.data);
    }).catch(err => {
      if (active) setError(err.response?.data?.error || t('dash.loadFail'));
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => { active = false; controller.abort(); };
  }, [refresh, user?.firebaseUid]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setLoadingWeather(true);
    setWeatherError('');
    setWeather(null);

    if (!navigator.geolocation) {
      setWeatherError(t('dash.noGeo'));
      setLoadingWeather(false);
      return () => { active = false; controller.abort(); };
    }

    navigator.geolocation.getCurrentPosition(async position => {
      if (!active) return;
      try {
        const response = await api.get('/weather/current', {
          params: { lat: position.coords.latitude, lon: position.coords.longitude },
          timeout: 15000,
          signal: controller.signal
        });
        const current = response.data?.current;
        if (!Number.isFinite(current?.main?.temp)) throw new Error('Invalid weather response');
        if (active) setWeather(current);
      } catch {
        if (active) setWeatherError(t('dash.weatherUnavailable'));
      } finally {
        if (active) setLoadingWeather(false);
      }
    }, err => {
      if (!active) return;
      setWeatherError(err.code === 1
        ? t('dash.allowLocation')
        : t('dash.noLocationFix'));
      setLoadingWeather(false);
    }, { timeout: 10000, maximumAge: 300000 });

    return () => { active = false; controller.abort(); };
  }, [refresh, user?.firebaseUid]);

  const userName = summary?.profile?.name || user?.name || user?.email?.split('@')[0] || 'Farmer';
  const location = summary?.profile?.location || user?.location || t('dash.noLocation');
  const stats = summary?.stats;
  const cards = [
    { label: t('dash.plans'), value: stats?.cultivationPlans, note: t('dash.plansNote'), Icon: Leaf },
    { label: t('dash.pendingTasks'), value: stats?.pendingTasks, note: t('dash.pendingNote'), Icon: Circle },
    { label: t('dash.completedTasks'), value: stats?.completedTasks, note: t('dash.completedNote'), Icon: CheckCircle2 },
    { label: t('dash.due7'), value: stats?.dueNext7Days, note: t('dash.due7Note'), Icon: Calendar }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-900">{t('dash.welcome')}, {userName}!</h1>
          <p className="text-green-700 mt-1 flex items-center gap-2"><MapPin className="h-4 w-4" />{location}</p>
        </div>
        <Button variant="outline" onClick={() => setRefresh(value => value + 1)} disabled={loading || loadingWeather}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loadingWeather ? (
            <p className="flex items-center gap-2 text-sm text-gray-600" role="status"><Loader2 className="h-4 w-4 animate-spin" />{t('dash.weatherLoadingLocal')}</p>
          ) : weather ? (
            <div className="flex flex-wrap items-center gap-6">
              <Cloud className="h-8 w-8 text-blue-600" />
              <div><p className="text-2xl font-bold">{Math.round(weather.main.temp)}°C</p><p className="text-sm capitalize text-gray-600">{weather.name} · {weather.weather?.[0]?.description || 'Current weather'}</p></div>
              <span className="flex items-center gap-2 text-sm"><Droplets className="h-4 w-4" />{weather.main.humidity ?? '—'}% humidity</span>
              <span className="flex items-center gap-2 text-sm"><Wind className="h-4 w-4" />{weather.wind?.speed ?? '—'} m/s wind</span>
              {weather.dt && <span className="text-xs text-gray-500">Observation: {new Date(weather.dt * 1000).toLocaleString('en-IN')}</span>}
            </div>
          ) : <p className="text-sm text-gray-600">{weatherError}</p>}
        </CardContent>
      </Card>

      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{error}{summary && ' The figures below are from the last successful refresh.'}</div>}
      {loading && !summary && <p role="status" className="flex items-center gap-2 text-gray-600"><Loader2 className="h-4 w-4 animate-spin" />{t('dash.loadingRecords')}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, note, Icon }) => (
          <Card key={label}>
            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">{label}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between"><div className="text-3xl font-bold text-green-900">{value ?? '—'}</div><Icon className="h-8 w-8 text-green-600" /></div>
              <p className="text-xs text-gray-500 mt-2">{note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {summary && (
        <>
          <Card>
            <CardHeader><CardTitle>{t('dash.progress')}</CardTitle><CardDescription>{stats!.completedTasks} of {stats!.totalTasks} tasks completed across your saved plans</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center gap-4"><progress aria-label="Overall task completion" className="w-full h-3" max={100} value={stats!.progressPercent} style={{ accentColor: '#16a34a' }} /><span className="font-semibold">{stats!.progressPercent}%</span></div>
              {stats!.overdueTasks > 0 && <p className="mt-3 text-sm text-amber-800">{stats!.overdueTasks} pending task{stats!.overdueTasks === 1 ? ' is' : 's are'} overdue.</p>}
              {stats!.cultivationPlans === 0 && <p className="mt-3 text-sm text-gray-600">{t('dash.createFirst')}</p>}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>{t('dash.tasksToDo')}</CardTitle><CardDescription>{t('dash.tasksToDoSub')}</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                {summary.nextTasks.length === 0 ? <p className="text-sm text-gray-600">{t('dash.noPending')}</p> : summary.nextTasks.map(task => (
                  <div key={`${task.cultivationId}-${task.id}`} className="rounded-lg border p-4">
                    <p className="font-semibold text-gray-900">{task.title}</p>
                    <p className="text-sm text-green-700 mt-1">{task.cropName}</p>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <p className={`text-xs mt-2 ${task.daysUntilDue < 0 ? 'text-red-700' : 'text-gray-600'}`}>{displayDate(task.dueDate)} · {dueLabel(task.daysUntilDue)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>{t('dash.recentPlans')}</CardTitle><CardDescription>{t('dash.recentPlansSub')}</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                {summary.recentPlans.length === 0 ? <p className="text-sm text-gray-600">{t('dash.noPlans')}</p> : summary.recentPlans.map(plan => (
                  <div key={plan.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between gap-3"><p className="font-semibold text-gray-900">{plan.cropName}</p><span className="text-sm text-green-700">{plan.progressPercent}%</span></div>
                    <p className="mt-1 text-sm text-gray-600">{plan.areaAcres} acres · Started {displayDate(plan.startDate)}</p>
                    <progress aria-label={`${plan.cropName} task completion`} className="w-full h-2 mt-3" max={100} value={plan.progressPercent} style={{ accentColor: '#16a34a' }} />
                    <p className="mt-1 text-xs text-gray-500">{plan.completedTasks} of {plan.totalTasks} tasks complete</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <p className="text-xs text-gray-500">Updated {new Date(summary.generatedAt).toLocaleString('en-IN')}. Counts cover all your saved plans except cancelled plans. Open Crop Roadmap to update the latest plan's tasks.</p>
        </>
      )}
    </div>
  );
}