import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, CheckCircle2, Circle, Calendar, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useTranslation } from '../i18n';

const ROADMAP_CROPS = ['Rice', 'Wheat', 'Tomato', 'Cotton', 'Potato', 'Maize', 'Sugarcane'];

// Advisor crops carry qualifiers like "Rice (Paddy)"; the roadmap keys on the bare name.
function normalizeCropName(name: string): string {
  const base = name.replace(/\s*\(.*?\)\s*/g, '').trim();
  return ROADMAP_CROPS.find((c) => c.toLowerCase() === base.toLowerCase()) ?? base;
}

interface CropRoadmapProps {
  prefill?: { cropName: string; landArea: string } | null;
}

export function CropRoadmap({ prefill }: CropRoadmapProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cropName: '',
    landArea: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (!prefill) return;
    setFormData((prev) => ({
      ...prev,
      cropName: normalizeCropName(prefill.cropName),
      landArea: prefill.landArea || prev.landArea
    }));
  }, [prefill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/roadmap/generate', formData);
      setRoadmap(response.data.roadmap);
    } catch (err) {
      console.error('Failed to generate roadmap:', err);
      setError(t('roadmap.error'));
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string) => {
    if (!roadmap?._id) return;
    try {
      const response = await api.patch(`/roadmap/${roadmap._id}/tasks/${taskId}`);
      setRoadmap(response.data.roadmap);
    } catch (err) {
      console.error('Failed to update task:', err);
      setError(t('roadmap.error'));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-900">{t('roadmap.title')} 📆</h1>
        <p className="text-green-700 mt-1">{t('roadmap.subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('roadmap.formTitle')}</CardTitle>
          <CardDescription>{t('roadmap.formSub')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cropName">{t('roadmap.cropName')}</Label>
                <Select
                  value={formData.cropName}
                  onValueChange={(value) => setFormData({ ...formData, cropName: value })}
                  required
                >
                  <SelectTrigger id="cropName">
                    <SelectValue placeholder={t('roadmap.selectCrop')} />
                  </SelectTrigger>
                  <SelectContent>
                    {ROADMAP_CROPS.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landArea">{t('advisor.landArea')}</Label>
                <Input
                  id="landArea"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 5.5"
                  value={formData.landArea}
                  onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">{t('roadmap.startDate')}</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('roadmap.generating')}
                </>
              ) : (
                t('roadmap.submit')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {roadmap && (
        <div className="space-y-4">
          {roadmap.usedFallbackTemplate && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>{t('roadmap.fallback')}</p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-green-900">
                {roadmap.cropName} — {t('roadmap.heading')}
              </h2>
              <p className="text-green-700 mt-1">
                {roadmap.landArea} {t('common.acres')} • {roadmap.totalWeeks} {t('roadmap.weeksDuration')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{t('roadmap.startDate')}</p>
              <p className="font-semibold text-gray-900">
                {new Date(roadmap.startDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-green-200"></div>

            {/* Tasks */}
            <div className="space-y-6">
              {roadmap.tasks.map((task: any, index: number) => (
                <div key={index} className="relative flex gap-4">
                  {/* Week marker */}
                  <div className="flex flex-col items-center">
                    <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white border-2 border-green-600 rounded-full">
                      <div className="text-center">
                        <div className="text-xs text-gray-600">{t('common.week')}</div>
                        <div className="text-lg font-bold text-green-900">{task.week}</div>
                      </div>
                    </div>
                  </div>

                  {/* Task card */}
                  <Card className={`flex-1 hover:shadow-md transition-shadow ${task.status === 'completed' ? 'bg-green-50/60' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2 gap-3">
                        <h3 className={`font-bold text-lg ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {task.task}
                        </h3>
                        <button
                          type="button"
                          onClick={() => toggleTask(task._id)}
                          title={task.status === 'completed' ? t('roadmap.done') : t('roadmap.markDone')}
                          className="flex-shrink-0 hover:scale-110 transition-transform"
                        >
                          {task.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400 hover:text-green-600" />
                          )}
                        </button>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">{task.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(
                            new Date(roadmap.startDate).getTime() + 
                            (task.week - 1) * 7 * 24 * 60 * 60 * 1000
                          ).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-900">
                ⏰ <strong>{t('roadmap.reminder')}</strong> {t('roadmap.reminderText')}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
