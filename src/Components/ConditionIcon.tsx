import { TiWeatherSunny } from "react-icons/ti";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { TiWeatherCloudy } from "react-icons/ti";
import { TiWeatherWindy } from "react-icons/ti";
import { TiWeatherShower } from "react-icons/ti";
import { TiWeatherSnow } from "react-icons/ti";
import { MdOutlineErrorOutline } from "react-icons/md";

export const getWeatherIcon = (condition: string): React.ReactNode => {
  switch (condition) {
    case "hot_and_humid":
      return <TiWeatherSunny />;
    case "warm_and_humid":
      return <TiWeatherPartlySunny />;
    case "mild_and_humid":
      return <TiWeatherPartlySunny />;
    case "normal":
      return <TiWeatherPartlySunny />;
    case "cold":
      return <TiWeatherCloudy />;
    case "windy":
      return <TiWeatherWindy />;
    case "light_rain":
      return <TiWeatherShower />;
    case "light_snow":
      return <TiWeatherSnow />;
    case "unknown_precipitation":
      return <MdOutlineErrorOutline />;
    // Add more cases based on your specific criteria
    default:
      return <MdOutlineErrorOutline />;
  }
};
