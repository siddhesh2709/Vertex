import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { TrendingUp, TrendingDown, Minus, IndianRupee } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface MarketAnalyticsProps {
  accessToken: string;
}

export function MarketAnalytics({ accessToken }: MarketAnalyticsProps) {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketPrices();
  }, []);

  const fetchMarketPrices = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e63c4de1/market-prices`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setPrices(data.prices || []);
      }
    } catch (error) {
      console.error('Failed to fetch market prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-900">Market Analytics 💰</h1>
        <p className="text-green-700 mt-1">Real-time crop prices and market trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prices.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{item.crop}</h3>
                  <p className="text-sm text-gray-600">per {item.unit}</p>
                </div>
                {getTrendIcon(item.trend)}
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <IndianRupee className="h-6 w-6 text-gray-900" />
                <span className="text-3xl font-bold text-gray-900">
                  {item.price.toLocaleString()}
                </span>
              </div>

              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${getTrendColor(item.trend)}`}>
                {item.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                {item.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                {item.trend === 'stable' && <Minus className="h-3 w-3" />}
                <span className="text-sm font-medium">
                  {item.change > 0 ? '+' : ''}{item.change}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profit/Loss Calculator</CardTitle>
          <CardDescription>Estimate your earnings based on current market rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Average Revenue/Acre</p>
              <p className="text-2xl font-bold text-green-700 flex items-center">
                <IndianRupee className="h-5 w-5" />
                45,000
              </p>
              <p className="text-xs text-green-600 mt-1">Based on current prices</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Average Cost/Acre</p>
              <p className="text-2xl font-bold text-red-700 flex items-center">
                <IndianRupee className="h-5 w-5" />
                27,000
              </p>
              <p className="text-xs text-red-600 mt-1">Seeds, fertilizer, labor</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Net Profit/Acre</p>
              <p className="text-2xl font-bold text-blue-700 flex items-center">
                <IndianRupee className="h-5 w-5" />
                18,000
              </p>
              <p className="text-xs text-blue-600 mt-1">~40% profit margin</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Crops</CardTitle>
            <CardDescription>Highest price growth this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prices
                .filter(p => p.trend === 'up')
                .sort((a, b) => b.change - a.change)
                .slice(0, 5)
                .map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.crop}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <IndianRupee className="h-3 w-3" />
                          {item.price}/{item.unit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                      <TrendingUp className="h-4 w-4" />
                      +{item.change}%
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
            <CardDescription>Key trends and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                <h4 className="font-semibold text-blue-900 mb-1">Strong Demand</h4>
                <p className="text-sm text-blue-800">
                  Tomato prices are up 12.5% due to increased urban demand and limited supply
                </p>
              </div>

              <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                <h4 className="font-semibold text-amber-900 mb-1">Hold Strategy</h4>
                <p className="text-sm text-amber-800">
                  Rice and wheat prices showing upward trend - consider delaying sale for better rates
                </p>
              </div>

              <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
                <h4 className="font-semibold text-purple-900 mb-1">Seasonal Advantage</h4>
                <p className="text-sm text-purple-800">
                  Kharif season approaching - maize and soybean expected to perform well
                </p>
              </div>

              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <h4 className="font-semibold text-green-900 mb-1">Export Opportunity</h4>
                <p className="text-sm text-green-800">
                  Government lifting export restrictions on selected crops - good news for farmers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">📱 Get Price Alerts</h3>
              <p className="text-green-100">
                Set up notifications for your crops and never miss the best selling opportunity
              </p>
            </div>
            <button className="px-6 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors">
              Enable Alerts
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
