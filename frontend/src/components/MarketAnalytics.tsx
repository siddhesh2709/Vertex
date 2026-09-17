import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { TrendingUp, TrendingDown, Minus, IndianRupee, AlertCircle, Loader2, MapPin } from 'lucide-react';
import api from '../services/api';
import { useTranslation } from '../i18n';

export function MarketAnalytics() {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/market/prices')
      .then((res) => setData(res.data))
      .catch((error) => {
        console.error('Failed to fetch market prices:', error);
        setFetchError(t('market.error'));
      })
      .finally(() => setLoading(false));
  }, []);

  const prices = (data?.prices || []).filter((p: any) => !p.unavailable);
  const unavailable = (data?.prices || []).filter((p: any) => p.unavailable);

  const trendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-5 w-5 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-5 w-5 text-red-600" />;
    if (trend === 'stable') return <Minus className="h-5 w-5 text-gray-500" />;
    return null;
  };

  const trendClass = (trend: string) => {
    if (trend === 'up') return 'text-green-600 bg-green-50';
    if (trend === 'down') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  // Widest gap between cheapest and dearest market - the real "where should I sell" signal.
  const spreads = prices
    .map((p: any) => ({
      crop: p.crop,
      spread: p.maxPrice - p.minPrice,
      minPrice: p.minPrice,
      maxPrice: p.maxPrice
    }))
    .sort((a: any, b: any) => b.spread - a.spread)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-green-900">{t('market.title')} 💰</h1>
          <p className="text-green-700 mt-1">{t('market.subtitle')}</p>
        </div>
        {data && (
          <div className="text-xs text-gray-600 text-right leading-relaxed">
            <div className="font-medium text-gray-800">{data.source}</div>
            <div>
              {prices[0]?.arrivalDate && <>{t('market.asOf')} {prices[0].arrivalDate}</>}
              {data.state && <> · {data.state}</>}
            </div>
          </div>
        )}
      </div>

      {data?.note && (
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-3 text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>{data.note}</p>
        </div>
      )}

      {fetchError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{fetchError}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-gray-500 py-8 justify-center">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{t('common.loading')}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prices.map((item: any) => (
          <Card key={item.crop} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{item.crop}</h3>
                  <p className="text-sm text-gray-600">{t('market.perQuintal')}</p>
                </div>
                {trendIcon(item.trend)}
              </div>

              <div className="flex items-baseline gap-1 mb-1">
                <IndianRupee className="h-6 w-6 text-gray-900" />
                <span className="text-3xl font-bold text-gray-900">
                  {item.avgModalPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                ₹{item.minPrice.toLocaleString()} – ₹{item.maxPrice.toLocaleString()} · {item.marketCount} {t('market.markets')}
              </p>

              {item.change !== null ? (
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${trendClass(item.trend)}`}>
                  {item.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                  {item.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                  {item.trend === 'stable' && <Minus className="h-3 w-3" />}
                  <span className="text-sm font-medium">
                    {item.change > 0 ? '+' : ''}{item.change}%
                  </span>
                </div>
              ) : (
                <span className="text-xs text-gray-500 italic">{t('market.noTrend')}</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {unavailable.length > 0 && (
        <p className="text-xs text-gray-500 italic">
          {t('market.noData')} {unavailable.map((u: any) => u.crop).join(', ')}
        </p>
      )}

      {spreads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('market.spreadTitle')}</CardTitle>
            <CardDescription>{t('market.spreadSub')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {spreads.map((s: any, index: number) => (
                <div key={s.crop} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{s.crop}</p>
                      <p className="text-sm text-gray-600">
                        ₹{s.minPrice.toLocaleString()} – ₹{s.maxPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-700 font-semibold">+₹{s.spread.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{t('market.perQuintalShort')}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data?.usingSampleKey && (
        <p className="text-xs text-gray-500 italic">{t('market.sampleKey')}</p>
      )}
    </div>
  );
}
