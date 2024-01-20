import { useEffect, useState } from "react";
import { T_location } from "./types";
import { getBackgroundColor, getWeatherCondition } from "./condition";
import { getWeatherIcon } from "./ConditionIcon";

export const Weather = ({
  location,
  setBg,
}: {
  location: T_location;
  setBg: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [weather_data, setWeather_data] = useState<any>(false);

  useEffect(() => {
    const data = async () => {
      // if (ev === undefined) return;
      // if (ev.key === "Enter" || val !== undefined) {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=" +
          location.lat +
          "&longitude=" +
          location.lon +
          "&current=temperature_2m,wind_speed_10m,relative_humidity_2m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation" +
          "&daily=temperature_2m_max,precipitation_sum,wind_speed_10m_max"
      );
      const data = await response.json();
      // localStorage.setItem("weather_data", JSON.stringify(data));
      setWeather_data(data);

      const color = getBackgroundColor(data);

      setBg(color);

      // console.log(location.lat, location.lon);
    };
    data();
  }, [location]);

  const weather_data_nexr_times = () => {
    const time: string[] = weather_data.daily.time;
    const data = weather_data.daily;

    const res: {
      temperature: number;
      windSpeed: number;
      precipitation: number;
    }[] = [];

    time.filter(
      (_, index: number) => {
        if (index !== 0) {
          const new_data = {
            temperature: data.temperature_2m_max[index],
            windSpeed: data.wind_speed_10m_max[index],
            precipitation: data.precipitation_sum[index],
          };
          res.push(new_data);
        }
      }
      // console.log(item, now_time);
    );

    const res2 = res.map(
      (
        {
          temperature,
          windSpeed,
          precipitation,
        }: {
          temperature: number;
          windSpeed: number;
          precipitation: number;
        },
        index
      ) => {
        const condition = getWeatherCondition(
          temperature,
          windSpeed,
          precipitation
        );

        const weatherIcon = getWeatherIcon(condition);

        return (
          <div key={index} className="flex flex-col items-center font-light">
            <p>{weather_data.daily.time[index + 1].slice(-2)}</p>

            {weatherIcon}
            <p>{temperature}°</p>
          </div>
        );
      }
    );

    return res2;
  };

  return (
    <div className=" mt-2 font-bold text-white">
      <p className="ml-3">
        {location &&
          location.name.charAt(0).toUpperCase() +
            location.name.toLowerCase().slice(1)}
      </p>
      {weather_data && (
        <>
          <div className=" ml-3">
            <span className="text-[40px] font-normal">
              {weather_data.current.temperature_2m}°
            </span>
            <p>{weather_data.current.wind_speed_10m + " km/h"}</p>
          </div>
          {/* <p>{weather_data.current.time}</p> */}
          <div className="flex flex-row gap-5 place-content-evenly pt-3 ">
            {weather_data_nexr_times()}
          </div>
        </>
      )}
    </div>
  );
};

// 2024-01-25T09:00 2024-01-20T09:00

// 2024-01-20T09:00 2024-01-20T09:00
