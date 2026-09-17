import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, Upload, Camera, AlertTriangle, CheckCircle, Leaf, AlertCircle } from 'lucide-react';
import api from '../services/api';

export function DiseaseDetection() {
  const [loading, setLoading] = useState(false);
  const [detection, setDetection] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cropType, setCropType] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview || !cropType) {
      setError('Please select a crop type and upload an image.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Note: the image itself isn't sent - this prototype doesn't analyze it (see banner above).
      const response = await api.post('/disease/detect', { cropType });
      setDetection(response.data.detection);
    } catch (err) {
      console.error('Failed to detect disease:', err);
      setError('Could not fetch a sample result right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImagePreview(null);
    setDetection(null);
    setCropType('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-900">Disease Detection (Prototype) 🔬</h1>
        <p className="text-green-700 mt-1">Interface preview for a future crop disease diagnosis feature</p>
      </div>

      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4">
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <p className="text-sm">
          <span className="font-semibold">Not a working model yet.</span> Your photo is not analyzed — the
          "result" below is picked randomly from a short sample list, for demonstration only. Do not use it to
          make real crop-treatment decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Crop Image</CardTitle>
            <CardDescription>Take a clear photo of the affected leaf or plant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cropType">Crop Type</Label>
              <Select value={cropType} onValueChange={setCropType}>
                <SelectTrigger id="cropType">
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rice">Rice</SelectItem>
                  <SelectItem value="Wheat">Wheat</SelectItem>
                  <SelectItem value="Tomato">Tomato</SelectItem>
                  <SelectItem value="Potato">Potato</SelectItem>
                  <SelectItem value="Cotton">Cotton</SelectItem>
                  <SelectItem value="Maize">Maize</SelectItem>
                  <SelectItem value="Chili">Chili</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Upload Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      type="button"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Camera className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      type="button"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Select Image
                    </Button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAnalyze}
                disabled={loading || !imagePreview || !cropType}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching sample result...
                  </>
                ) : (
                  <>
                    <Leaf className="mr-2 h-4 w-4" />
                    Show Sample Result
                  </>
                )}
              </Button>
              {(imagePreview || detection) && (
                <Button variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              )}
            </div>
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {detection && (
          <Card className="border-2 border-orange-200">
            <CardHeader className="bg-orange-50">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Sample Result
              </CardTitle>
              <CardDescription>Randomly selected — not derived from your photo</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{detection.name}</h3>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    {Math.round(detection.confidence * 100)}% confidence (sample value)
                  </span>
                </div>
                <p className="text-gray-700">{detection.description}</p>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Treatment Methods
                </h4>
                <ul className="space-y-2">
                  {detection.treatment.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-blue-600" />
                  Prevention Tips
                </h4>
                <ul className="space-y-2">
                  {detection.prevention.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-amber-900">
                    <strong>Note:</strong> This result is a placeholder for demonstration only — no image
                    analysis was performed. Always consult a local agricultural expert or extension officer
                    for a real diagnosis.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}

        {!detection && (
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="pt-6 pb-6">
              <div className="text-center space-y-4">
                <Leaf className="h-16 w-16 mx-auto text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    How It Works
                  </h3>
                  <div className="text-left space-y-3 text-sm text-gray-700 max-w-md mx-auto">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-green-700">1.</span>
                      <span>Select your crop type from the dropdown</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-green-700">2.</span>
                      <span>Upload a clear photo of the infected leaf or plant part</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-green-700">3.</span>
                      <span>A sample result is shown (image analysis is not implemented yet)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-green-700">4.</span>
                      <span>See example treatment and prevention tips for that sample result</span>
                    </div>
                  </div>
                </div>
                <Card className="bg-white">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-gray-600">
                      💡 <strong>Pro Tip:</strong> Take photos in natural daylight for best results. 
                      Focus on the affected area and ensure the image is not blurry.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
