import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastList from './components/ForecastList';
import Favorites from './components/Favorites';
import { getCurrentWeather, getWeatherForecast, getWeatherByCoords, getWeatherBackground } from './utils/weather';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('celsius');
  const [favorites, setFavorites] = useState([]);
  const [backgroundClass, setBackgroundClass] = useState('from-blue-400 via-blue-500 to-blue-600');

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('weatherFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Update background when weather changes
  useEffect(() => {
    if (weather) {
      setBackgroundClass(getWeatherBackground(weather.weather[0].main));
    }
  }, [weather]);

  const searchWeather = async (city) => {
    setLoading(true);
    setError('');

    try {
      const currentWeather = await getCurrentWeather(city);
      setWeather(currentWeather);

      // Fetch forecast using coordinates from current weather
      const forecastData = await getWeatherForecast(
        currentWeather.coord.lat,
        currentWeather.coord.lon
      );
      setForecast(forecastData);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const searchWeatherByLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Get current weather by coordinates
          const currentWeather = await getWeatherByCoords(latitude, longitude);
          setWeather(currentWeather);

          // Get forecast
          const forecastData = await getWeatherForecast(latitude, longitude);
          setForecast(forecastData);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError('Failed to get your location');
        setLoading(false);
      }
    );
  };

  const toggleUnit = () => {
    setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const toggleFavorite = (city) => {
    const isAlreadyFavorite = favorites.find(fav => fav.name === city.name);

    if (isAlreadyFavorite) {
      setFavorites(favorites.filter(fav => fav.name !== city.name));
    } else {
      const favoriteCity = {
        name: city.name,
        country: city.sys.country,
        lat: city.coord.lat,
        lon: city.coord.lon
      };
      setFavorites([...favorites, favoriteCity]);
    }
  };

  const removeFavorite = (cityId) => {
    setFavorites(favorites.filter(fav => `${fav.name}-${fav.country}` !== cityId));
  };


  const selectFavoriteCity = (cityName) => {
    searchWeather(cityName);
  };

  const handleRefresh = () => {
    if (weather) {
      searchWeather(weather.name);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundClass} transition-all duration-700 ease-in-out`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Weather Forecast
          </h1>
          <p className="text-white/80 text-lg">
            Get accurate weather information for any city worldwide
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleUnit}
              className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-all duration-200 border border-white/30"
            >
              <span className="font-medium">
                {unit === 'celsius' ? '°C' : '°F'}
              </span>
            </button>

            {weather && (
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-all duration-200 border border-white/30 disabled:opacity-50"
              >
                <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="font-medium">Refresh</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          onSearch={searchWeather}
          onLocationSearch={searchWeatherByLocation}
          isLoading={loading}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-xl p-4 mb-8">
            <p className="text-red-100 text-center">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center mb-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div>
            <p className="text-white/80 mt-4">Loading weather data...</p>
          </div>
        )}

        {/* Weather Content */}
        {weather && !loading && (
          <>
            <WeatherCard weather={weather} unit={unit} />
            {forecast && <ForecastList forecast={forecast} unit={unit} />}
          </>
        )}

        {/* Favorites Section */}
        <Favorites
          favorites={favorites}
          onSelectCity={selectFavoriteCity}
          onRemoveFavorite={removeFavorite}
          onToggleFavorite={toggleFavorite}
          currentCity={weather}
        />

        {/* API Key Notice */}
        {!import.meta.env.VITE_WEATHER_API_KEY && (
          <div className="fixed bottom-4 right-4 bg-yellow-500/20 backdrop-blur-sm border border-yellow-300/30 rounded-xl p-4 max-w-sm">
            <p className="text-yellow-100 text-sm">
              <strong>API Key Required:</strong> Please add your OpenWeatherMap API key to the .env file to fetch live weather data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
