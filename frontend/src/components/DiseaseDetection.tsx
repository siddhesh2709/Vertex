import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, Upload, Camera, AlertTriangle, CheckCircle, Leaf, AlertCircle, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useTranslation } from '../i18n';

export function DiseaseDetection() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [detection, setDetection] = useState<any>(null);
  const [alternatives, setAlternatives] = useState<any[]>([]);
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropType, setCropType] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get('/disease/model-info')
      .then((res) => setModelInfo(res.data))
      .catch(() => setModelInfo(null));
  }, []);

  const supportedCrops: string[] = modelInfo?.supportedCrops || ['Tomato', 'Potato', 'Maize', 'Pepper'];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setDetection(null);
    setNotice(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !cropType) {
      setError(t('disease.needBoth'));
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);
    setDetection(null);

    const formData = new FormData();
    formData.append('cropType', cropType);
    formData.append('image', selectedFile);

    try {
      const response = await api.post('/disease/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.notALeaf) {
        setNotice(t('disease.notALeaf'));
      } else if (response.data.mismatch) {
        const guess = response.data.bestGuess;
        const hint = guess
          ? ` ${t('disease.bestGuess')} ${guess.name} (${guess.crop}, ${Math.round(guess.confidence * 100)}%)`
          : '';
        setNotice(t('disease.mismatch').replace('{crop}', cropType) + hint);
      } else {
        setDetection(response.data.detection);
        setAlternatives(response.data.alternatives || []);
      }
    } catch (err: any) {
      console.error('Failed to analyze image:', err);
      const data = err?.response?.data;
      if (data?.error === 'unsupported_crop') {
        setNotice(`${t('disease.unsupported')} ${data.supportedCrops.join(', ')}`);
      } else if (err?.response?.status === 503) {
        setNotice(t('disease.unavailable'));
      } else {
        setError(t('disease.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setDetection(null);
    setAlternatives([]);
    setCropType('');
    setError(null);
    setNotice(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-green-900">{t('disease.title')} 🔬</h1>
          <p className="text-green-700 mt-1">{t('disease.subtitle')}</p>
        </div>
        {modelInfo?.metrics && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-900 rounded-lg px-3 py-2">
            <ShieldCheck className="h-5 w-5 text-green-700 flex-shrink-0" />
            <div className="text-xs leading-tight">
              <div className="font-semibold">
                {(modelInfo.metrics.testAccuracy * 100).toFixed(1)}% test accuracy
              </div>
              <div className="text-green-700">
                {modelInfo.metrics.architecture} · {modelInfo.classes.length} classes
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('disease.uploadTitle')}</CardTitle>
            <CardDescription>{t('disease.uploadSub')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cropType">{t('disease.cropType')}</Label>
              <Select value={cropType} onValueChange={setCropType}>
                <SelectTrigger id="cropType">
                  <SelectValue placeholder={t('disease.selectCrop')} />
                </SelectTrigger>
                <SelectContent>
                  {supportedCrops.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('disease.uploadImage')}</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} type="button">
                      <Upload className="mr-2 h-4 w-4" />
                      {t('disease.changeImage')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Camera className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-gray-600 mb-2">{t('disease.dropHint')}</p>
                      <p className="text-sm text-gray-500">{t('disease.fileHint')}</p>
                    </div>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} type="button">
                      <Upload className="mr-2 h-4 w-4" />
                      {t('disease.selectImage')}
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
              <Button onClick={handleAnalyze} disabled={loading || !imagePreview || !cropType} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('disease.analyzing')}
                  </>
                ) : (
                  <>
                    <Leaf className="mr-2 h-4 w-4" />
                    {t('disease.analyze')}
                  </>
                )}
              </Button>
              {(imagePreview || detection) && (
                <Button variant="outline" onClick={resetForm}>{t('common.reset')}</Button>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            {notice && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{notice}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {detection && (
          <Card className={`border-2 ${detection.healthy ? 'border-green-200' : 'border-orange-200'}`}>
            <CardHeader className={detection.healthy ? 'bg-green-50' : 'bg-orange-50'}>
              <CardTitle className="flex items-center gap-2">
                {detection.healthy ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                )}
                {t('disease.resultTitle')}
              </CardTitle>
              <CardDescription>{t('disease.resultSub')}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2 gap-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {detection.healthy ? detection.name : `${t('disease.likely')} ${detection.name}`}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                      detection.healthy ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {Math.round(detection.confidence * 100)}% {t('disease.modelConfidence')}
                  </span>
                </div>
                <p className="text-gray-700">{detection.description}</p>
              </div>

              {detection.treatment?.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    {t('disease.treatment')}
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
              )}

              {detection.prevention?.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-blue-600" />
                    {t('disease.prevention')}
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
              )}

              {alternatives.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Other possibilities considered</p>
                  <div className="flex flex-wrap gap-2">
                    {alternatives.map((alt: any, i: number) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {alt.name} · {Math.round(alt.confidence * 100)}%
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-amber-900">
                    <strong>{t('disease.note')}</strong> {t('disease.noteText')}
                  </p>
                  <p className="text-xs text-amber-900 mt-2">
                    {t('disease.leafOnlyNote')}
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
                  <h3 className="text-lg font-semibold text-green-900 mb-2">{t('disease.howTitle')}</h3>
                  <div className="text-left space-y-3 text-sm text-gray-700 max-w-md mx-auto">
                    {[t('disease.how1'), t('disease.how2'), t('disease.how3'), t('disease.how4')].map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="font-semibold text-green-700">{i + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Card className="bg-white">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-gray-600">
                      💡 <strong>{t('disease.proTip')}</strong> {t('disease.proTipText')}
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
