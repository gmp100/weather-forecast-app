const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHER_BASE_URL;

//  Current weather by city name
export const getCurrentWeather = async (city) => {
  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "City not found");
  }

  return response.json();
};

//  7-day / 3-hour forecast (Free API → converted to daily)
export const getWeatherForecast = async (lat, lon) => {
  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch forecast");
  }

  const data = await response.json();

  // Group data by day
  const dailyData = {};
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString("en-US");
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(item);
  });

  // Create daily summary (min/max/average)
  const daily = Object.keys(dailyData).map((date) => {
    const dayItems = dailyData[date];
    const minTemp = Math.min(...dayItems.map((i) => i.main.temp_min));
    const maxTemp = Math.max(...dayItems.map((i) => i.main.temp_max));
    const avgTemp = 
      dayItems.reduce((sum, i) => sum + i.main.temp, 0) / dayItems.length;

    return {
      dt: dayItems[0].dt,
      temp: { min: minTemp, max: maxTemp, day: avgTemp },
      weather: [dayItems[0].weather[0]],
      humidity: dayItems[0].main.humidity,
      wind_speed: dayItems[0].wind.speed,
    };
  });

  return { daily };
};

// Weather by coordinates (for geolocation)
export const getWeatherByCoords = async (lat, lon) => {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch weather");
  }

  return response.json();
};

// Convert Celsius ↔ Fahrenheit
export const convertTemp = (temp, unit) => {
  if (unit === "fahrenheit") {
    return Math.round((temp * 9) / 5 + 32);
  }
  return Math.round(temp);
};

// Weather Icon mapping (Lucide icons)
export const getWeatherIcon = (weatherMain = "Clouds") => {
  const iconMap = {
    Clear: "Sun",
    Clouds: "Cloud",
    Rain: "CloudRain",
    Drizzle: "CloudDrizzle",
    Snow: "Snowflake",
    Thunderstorm: "Zap",
    Mist: "CloudFog",
    Fog: "CloudFog",
    Haze: "CloudFog",
    Smoke: "CloudFog",
    Dust: "Wind",
    Sand: "Wind",
    Tornado: "Tornado",
  };

  return iconMap[weatherMain] || "Cloud";
};

// Background gradients
export const getWeatherBackground = (weatherMain = "Clear") => {
  const backgroundMap = {
    Clear: "from-blue-400 via-blue-500 to-blue-600",
    Clouds: "from-gray-400 via-gray-500 to-gray-600",
    Rain: "from-gray-600 via-gray-700 to-gray-800",
    Drizzle: "from-gray-500 via-gray-600 to-gray-700",
    Snow: "from-blue-100 via-blue-200 to-gray-300",
    Thunderstorm: "from-gray-700 via-gray-800 to-gray-900",
    Mist: "from-gray-300 via-gray-400 to-gray-500",
    Fog: "from-gray-300 via-gray-400 to-gray-500",
    Haze: "from-gray-300 via-gray-400 to-gray-500",
    Smoke: "from-gray-400 via-gray-500 to-gray-600",
    Dust: "from-yellow-300 via-yellow-400 to-yellow-500",
    Sand: "from-yellow-400 via-yellow-500 to-yellow-600",
    Tornado: "from-gray-800 via-gray-900 to-black",
  };

  return backgroundMap[weatherMain] || "from-blue-400 via-blue-500 to-blue-600";
};
