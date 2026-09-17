import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, CheckCircle2, Circle, Calendar } from 'lucide-react';
import api from '../services/api';
import { useTranslation } from '../i18n';

// Advisor crops carry qualifiers like "Rice (Paddy)"; the roadmap keys on the bare name.
const ROADMAP_CROPS = ['Rice', 'Wheat', 'Tomato', 'Cotton', 'Potato', 'Maize', 'Sugarcane'];

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
  const [formData, setFormData] = useState({
    cropName: '',
    landArea: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  // Pre-fill when a crop was sent over from Crop Advisor.
  useEffect(() => {
    if (!prefill) return;
    setFormData((prev) => ({
      ...prev,
      cropName: normalizeCropName(prefill.cropName),
      landArea: prefill.landArea || prev.landArea
    }));
  }, [prefill]);

  const [loadingSaved, setLoadingSaved] = useState(true);
  const [updatingTask, setUpdatingTask] = useState<string | null>(null);
  const taskUpdateInFlight = useRef(false);

  const toggleTask = async (task: any) => {
    if (!roadmap?._id || !task._id || taskUpdateInFlight.current || loading || loadingSaved) return;

    const cultivationId = roadmap._id;
    taskUpdateInFlight.current = true;
    setUpdatingTask(task._id);

    try {
      const response = await api.patch(
        `/cultivations/${cultivationId}/tasks/${task._id}`,
        { status: task.status === 'completed' ? 'pending' : 'completed' },
        { timeout: 15000 }
      );

      const updatedTask = response.data.task;

      setRoadmap((current: any) => {
        if (current?._id !== cultivationId) return current;

        return {
          ...current,
          tasks: current.tasks.map((item: any) =>
            item._id === updatedTask._id
              ? { ...item, status: updatedTask.status, completedAt: updatedTask.completedAt }
              : item
          )
        };
      });
    } catch (error: any) {
      console.error('Update task error:', error);
      alert(
        error.response?.data?.error ||
        'Could not confirm the update. Refresh to check before retrying.'
      );
    } finally {
      taskUpdateInFlight.current = false;
      setUpdatingTask(null);
    }
  };

  useEffect(() => {
    let active = true;

    const loadSavedRoadmap = async () => {
      try {
        const response = await api.get('/cultivations/latest', {
          timeout: 15000
        });

        if (!active) return;

        const savedPlan = response.data.cultivation;

        // A new account may not have any cultivation plans yet.
        if (!savedPlan) return;

        const startTime = new Date(savedPlan.startDate).getTime();

        const tasks = savedPlan.tasks.map((task: any) => ({
          ...task,
          task: task.title,
          week:
            Math.round(
              (new Date(task.dueDate).getTime() - startTime) /
                (7 * 24 * 60 * 60 * 1000)
            ) + 1
        }));

        setRoadmap({
          ...savedPlan,
          cropName: savedPlan.crop?.name || 'Previously selected crop',
          landArea: savedPlan.areaAcres,
          totalWeeks: Math.max(1, ...tasks.map((task: any) => task.week)),
          tasks
        });
      } catch (error: any) {
        if (active) {
          console.error('Load roadmap error:', error);
          alert(
            error.response?.data?.error ||
            'Could not load your saved roadmap. Please refresh to retry.'
          );
        }
      } finally {
        if (active) setLoadingSaved(false);
      }
    };

    loadSavedRoadmap();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || loadingSaved || taskUpdateInFlight.current) return;
    setLoading(true);

    try {
      // Find the database ID for the selected crop.
      const cropsResponse = await api.get('/crops/all', {
        timeout: 15000
      });

      const cropName =
        formData.cropName === 'Rice'
          ? 'Rice (Paddy)'
          : formData.cropName;

      const selectedCrop = cropsResponse.data.find(
        (crop: any) => crop.name === cropName
      );

      if (!selectedCrop) {
        throw new Error(
          'This crop is not available yet. Select Rice, Wheat, Tomato, or Cotton.'
        );
      }

      // The API client automatically attaches the Firebase login token.
      const response = await api.post(
        '/cultivations',
        {
          cropId: selectedCrop._id,
          areaAcres: Number(formData.landArea),
          startDate: formData.startDate
        },
        { timeout: 15000 }
      );

      const savedPlan = response.data.cultivation;

      // Adapt saved tasks to the existing timeline display.
      const startTime = new Date(savedPlan.startDate).getTime();

      const tasks = savedPlan.tasks.map((task: any) => ({
        ...task,
        task: task.title,
        week:
          Math.round(
            (new Date(task.dueDate).getTime() - startTime) /
              (7 * 24 * 60 * 60 * 1000)
          ) + 1
      }));

      setRoadmap({
        ...savedPlan,
        cropName: savedPlan.crop.name,
        landArea: savedPlan.areaAcres,
        totalWeeks: Math.max(1, ...tasks.map((task: any) => task.week)),
        tasks
      });
    } catch (error: any) {
      console.error('Failed to save roadmap:', error);

      const message =
        error.response?.data?.error ||
        error.message ||
        'Could not save the roadmap. Please try again.';

      alert(message);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-900">{t('roadmap.title')} 📆</h1>
        <p className="text-green-700 mt-1">Get a week-by-week plan for your crop cultivation</p>
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
                    <SelectItem value="Rice">Rice</SelectItem>
                    <SelectItem value="Wheat">Wheat</SelectItem>
                    <SelectItem value="Tomato">Tomato</SelectItem>
                    <SelectItem value="Cotton">Cotton</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landArea">{t('advisor.landArea')}</Label>
                <Input
                  id="landArea"
                  type="number"
                  step="0.01"
                  min="0.01"
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

            <Button type="submit" disabled={loading || loadingSaved || updatingTask !== null} className="w-full">
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

      {loadingSaved && (
        <p className="text-sm text-gray-600" role="status">
          Loading your saved roadmap...
        </p>
      )}

      {roadmap && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-green-900">
                {roadmap.cropName} Cultivation Roadmap
              </h2>
              <p className="text-green-700 mt-1">
                {roadmap.landArea} acres • {roadmap.totalWeeks} weeks duration
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="font-semibold text-gray-900">
                {new Date(roadmap.startDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC'
                })}
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-green-200"></div>

            {/* Tasks */}
            <div className="space-y-6">
              {roadmap.tasks.map((task: any) => (
                <div key={task._id} className="relative flex gap-4">
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
                  <Card className="flex-1 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{task.task}</h3>
                        <button
                          type="button"
                          onClick={() => toggleTask(task)}
                          disabled={updatingTask !== null || loading || loadingSaved}
                          aria-pressed={task.status === 'completed'}
                          aria-label={
                            task.status === 'completed'
                              ? `Mark ${task.task} as pending`
                              : `Mark ${task.task} as completed`
                          }
                          className="flex flex-shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
                        >
                          {updatingTask === task._id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : task.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                          {updatingTask === task._id
                            ? 'Saving...'
                            : task.status === 'completed'
                              ? 'Completed'
                              : 'Mark done'}
                        </button>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">{task.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(task.dueDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            timeZone: 'UTC'
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
                <strong>Planning note:</strong> This schedule uses a crop-specific template.
                Adjust activities to local conditions and mark tasks complete as you finish them.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
