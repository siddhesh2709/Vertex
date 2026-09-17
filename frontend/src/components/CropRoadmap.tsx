import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, CheckCircle2, Circle, Calendar, AlertCircle } from 'lucide-react';
import api from '../services/api';

export function CropRoadmap() {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cropName: '',
    landArea: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/roadmap/generate', formData);
      setRoadmap(response.data.roadmap);
    } catch (err) {
      console.error('Failed to generate roadmap:', err);
      setError('Could not generate a roadmap right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-900">Smart Crop Roadmap 📆</h1>
        <p className="text-green-700 mt-1">Get a week-by-week plan for your crop cultivation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Your Crop</CardTitle>
          <CardDescription>Generate a customized farming schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cropName">Crop Name</Label>
                <Select
                  value={formData.cropName}
                  onValueChange={(value) => setFormData({ ...formData, cropName: value })}
                  required
                >
                  <SelectTrigger id="cropName">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rice">Rice</SelectItem>
                    <SelectItem value="Wheat">Wheat</SelectItem>
                    <SelectItem value="Tomato">Tomato</SelectItem>
                    <SelectItem value="Cotton">Cotton</SelectItem>
                    <SelectItem value="Potato">Potato</SelectItem>
                    <SelectItem value="Maize">Maize</SelectItem>
                    <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landArea">Land Area (acres)</Label>
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
                <Label htmlFor="startDate">Start Date</Label>
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
                  Generating Roadmap...
                </>
              ) : (
                'Generate Roadmap'
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
              <p>We don't have a dedicated template for {roadmap.cropName} yet — showing a generic schedule instead.</p>
            </div>
          )}
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
                        <div className="text-xs text-gray-600">Week</div>
                        <div className="text-lg font-bold text-green-900">{task.week}</div>
                      </div>
                    </div>
                  </div>

                  {/* Task card */}
                  <Card className="flex-1 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{task.task}</h3>
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        )}
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
                ⏰ <strong>Reminder:</strong> Set up notifications for upcoming tasks to stay on track. 
                Weather conditions and pest pressure may require adjusting this schedule.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
