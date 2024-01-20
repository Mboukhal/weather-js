export const getWeatherCondition = (
  temperature: number,
  windSpeed: number,
  precipitation: number
): string => {
  if (precipitation > 0.1) {
    if (temperature > 0 && temperature < 5) {
      return "light_snow";
    } else if (temperature >= 5) {
      return "light_rain";
    } else {
      return "unknown_precipitation";
    }
  } else {
    if (temperature > 25) {
      return "hot_and_humid";
    } else if (temperature > 15 && temperature <= 25) {
      return "warm_and_humid";
    } else if (temperature > 5 && temperature <= 15) {
      return "mild_and_humid";
    } else if (temperature <= 5) {
      return "cold";
    } else if (windSpeed > 15) {
      return "windy";
    } else {
      return "normal";
    }
  }
};

export const getBackgroundColor = (weatherData: any): string => {
  if (weatherData) {
    const temperature = weatherData.current.temperature_2m;
    // const humidity = weatherData.hourly.relative_humidity_2m[0];
    const windSpeed = weatherData.current.wind_speed_10m;
    const precipitation = weatherData.hourly.precipitation[0] || 0;

    const weatherCondition = getWeatherCondition(
      temperature,
      windSpeed,
      precipitation
    );

    switch (weatherCondition) {
      case "hot_and_humid":
        return "sunny";
      case "warm_and_humid":
        return "sunny";
      case "mild_and_humid":
        return "day";
      case "cold":
        return "snow";
      case "windy":
        return "day";
      case "light_rain":
        return "rain";
      case "light_snow":
        return "snow";
      case "unknown_precipitation":
        return "day";
      // Add more cases based on your specific criteria
      default:
        return "day";
    }
  }

  return "day"; // Default background color if weather data is not available
};
