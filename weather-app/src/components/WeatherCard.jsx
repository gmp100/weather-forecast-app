import React from 'react';
import { Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import { convertTemp, getWeatherIcon } from '../utils/weather';
import * as Icons from 'lucide-react';

const WeatherCard = ({ weather, unit }) => {
  if (!weather) return null;

  const IconComponent = Icons[getWeatherIcon(weather.weather[0].main)];
  const temperature = convertTemp(weather.main.temp, unit);
  const feelsLike = convertTemp(weather.main.feels_like, unit);
  const unitSymbol = unit === 'celsius' ? '°C' : '°F';

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/30 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          {weather.name}, {weather.sys.country}
        </h2>
        <p className="text-white/80 capitalize text-lg">
          {weather.weather[0].description}
        </p>
      </div>

      <div className="flex items-center justify-center mb-8">
        <IconComponent className="h-24 w-24 text-white mr-6" />
        <div className="text-center">
          <div className="text-6xl font-bold text-white mb-2">
            {temperature}{unitSymbol}
          </div>
          <p className="text-white/80 text-lg">
            Feels like {feelsLike}{unitSymbol}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white/10 rounded-xl p-4 text-center">
          <Thermometer className="h-8 w-8 text-white mx-auto mb-2" />
          <p className="text-white/80 text-sm mb-1">Min/Max</p>
          <p className="text-white font-semibold">
            {convertTemp(weather.main.temp_min, unit)}/{convertTemp(weather.main.temp_max, unit)}{unitSymbol}
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-4 text-center">
          <Droplets className="h-8 w-8 text-white mx-auto mb-2" />
          <p className="text-white/80 text-sm mb-1">Humidity</p>
          <p className="text-white font-semibold">{weather.main.humidity}%</p>
        </div>

        <div className="bg-white/10 rounded-xl p-4 text-center">
          <Wind className="h-8 w-8 text-white mx-auto mb-2" />
          <p className="text-white/80 text-sm mb-1">Wind</p>
          <p className="text-white font-semibold">{weather.wind.speed} m/s</p>
        </div>

        <div className="bg-white/10 rounded-xl p-4 text-center">
          <Eye className="h-8 w-8 text-white mx-auto mb-2" />
          <p className="text-white/80 text-sm mb-1">Visibility</p>
          <p className="text-white font-semibold">
            {weather.visibility ? (weather.visibility / 1000).toFixed(1) + ' km' : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;