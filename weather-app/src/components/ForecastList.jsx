import React from 'react';
import { convertTemp, getWeatherIcon } from '../utils/weather';
import * as Icons from 'lucide-react';

const ForecastList = ({ forecast, unit }) => {
  if (!forecast || !forecast.daily || !Array.isArray(forecast.daily)) return null;

  const unitSymbol = unit === 'celsius' ? '°C' : '°F';

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        7-Day Forecast
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {forecast.daily.slice(0, 7).map((day, index) => {
          const iconName = getWeatherIcon(day.weather[0].main);
          const IconComponent = Icons[iconName] || Icons.Cloud;
          const maxTemp = convertTemp(day.temp.max, unit);
          const minTemp = convertTemp(day.temp.min, unit);

          return (
            <div
              key={day.dt || index}
              className="bg-white/15 backdrop-blur-sm rounded-xl p-6 hover:bg-white/25 transition-all duration-300 border border-white/20"
            >
              <div className="text-center">
                <p className="text-white/90 font-medium mb-3">
                  {index === 0 ? 'Today' : formatDate(day.dt)}
                </p>

                <IconComponent className="h-12 w-12 text-white mx-auto mb-3" />

                <p className="text-white/80 text-sm capitalize mb-3">
                  {day.weather[0].description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-lg">
                    {maxTemp}{unitSymbol}
                  </span>
                  <span className="text-white/70 text-sm">
                    {minTemp}{unitSymbol}
                  </span>
                </div>

                <div className="mt-3 flex justify-center items-center space-x-2">
                  <div className="flex items-center text-white/70 text-xs">
                    <Icons.Droplets className="h-3 w-3 mr-1" />
                    <span>{day.humidity ?? '-'}%</span>
                  </div>
                  <div className="flex items-center text-white/70 text-xs">
                    <Icons.Wind className="h-3 w-3 mr-1" />
                    <span>{day.wind_speed ?? '-'} m/s</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastList;
