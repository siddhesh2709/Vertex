import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, Droplets, TrendingUp, Clock, IndianRupee, MapPin, AlertCircle } from 'lucide-react';
import api from '../services/api';

export function CropRecommendation() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    soilType: '',
    landArea: '',
    location: '',
    season: 'kharif'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Update user profile with farm details
      await api.put('/users/profile', {
        soilType: formData.soilType,
        farmSize: parseFloat(formData.landArea),
        location: formData.location
      });

      // 2. Get recommendations, filtered by soil (profile) and season (query param)
      const response = await api.get('/crops/recommendations', {
        params: { season: formData.season }
      });
      setRecommendations(response.data);
    } catch (err) {
      console.error('Failed to get recommendations:', err);
      setError('Could not fetch recommendations right now. Please check your connection and try again.');
      setRecommendations([]);
    } finally {
      setHasSearched(true);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-900">Crop Advisor 🌱</h1>
        <p className="text-green-700 mt-1">Get crop suggestions matched to your soil and land</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Your Farm Details</CardTitle>
          <CardDescription>We'll analyze and recommend the best crops for you</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="soilType">Soil Type</Label>
                <Select value={formData.soilType} onValueChange={(v: string) => setFormData({ ...formData, soilType: v })} required>
                  <SelectTrigger id="soilType"><SelectValue placeholder="Select soil type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alluvial">Alluvial Soil</SelectItem>
                    <SelectItem value="Black">Black Soil</SelectItem>
                    <SelectItem value="Red">Red Soil</SelectItem>
                    <SelectItem value="Laterite">Laterite Soil</SelectItem>
                    <SelectItem value="Desert">Desert Soil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="landArea">Land Area (acres)</Label>
                <Input id="landArea" type="number" step="0.1" placeholder="e.g., 5.5" value={formData.landArea} onChange={(e) => setFormData({ ...formData, landArea: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., Pune, Maharashtra" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="season">Season</Label>
                <Select value={formData.season} onValueChange={(v: string) => setFormData({ ...formData, season: v })}>
                  <SelectTrigger id="season"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                    <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                    <SelectItem value="zaid">Zaid (Summer)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get Recommendations'}
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

      {!error && hasSearched && !loading && recommendations.length === 0 && (
        <div className="flex flex-col items-center text-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-8">
          <AlertCircle className="h-8 w-8 text-amber-600" />
          <p className="font-medium">No matching crops found for {formData.soilType} soil in {formData.season} season</p>
          <p className="text-sm text-amber-700">Our seeded crop set is small right now — try a different soil type or season.</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-900">Recommended Crops for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((crop: any) => (
              <Card key={crop._id} className="hover:shadow-lg transition-shadow overflow-hidden">
                {crop.imageURL && <img src={crop.imageURL} alt={crop.name} className="w-full h-40 object-cover" />}
                <CardHeader>
                  <CardTitle className="text-xl">{crop.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{crop.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1"><Clock className="h-4 w-4" /> Duration</span>
                    <span className="font-medium">{crop.harvestTime || '120 days'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1"><Droplets className="h-4 w-4" /> Soil Match</span>
                    <span className="font-medium">{formData.soilType}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-xs font-semibold text-green-800 mb-1">Benefits:</p>
                    <div className="flex flex-wrap gap-1">
                      {crop.benefits?.slice(0, 3).map((b: string, i: number) => (
                        <span key={i} className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px]">{b}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
