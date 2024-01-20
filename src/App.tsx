/* eslint-disable @typescript-eslint/no-explicit-any */
import "./App.css";
import { RiDragMoveFill } from "react-icons/ri";
import { FaLocationDot } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { ipcRenderer } from "electron";

import { TextField, Autocomplete } from "@mui/material";
import { Weather } from "./Components/Weather";
import { T_location } from "./Components/types";

function App() {
  const [location, setLocation] = useState<T_location[]>([]);
  const [location_data, setLocation_data] = useState<T_location>({} as any);
  const [sercheButton, setSercheButton] = useState<boolean>(false);
  const [weather_data, setWeather_data] = useState<boolean>(false);

  const [bg, setBg] = useState<string>("");

  const [menu, setMenu] = useState<boolean>(false);

  useEffect(() => {
    const data = localStorage.getItem("weather_location");
    if (data) {
      setLocation_data(JSON.parse(data));
      setWeather_data(true);
    }
  }, []);

  useEffect(() => {
    ipcRenderer.on("out-of-window", () => {
      setMenu(false);
      if (sercheButton) {
        setSercheButton(false);
        setLocation([]);
      }
    });
    ipcRenderer.on("focus-on-window", () => {
      setMenu(true);
    });
    return () => {
      localStorage.setItem("weather_data", "");
    };
  }, [sercheButton]);

  const getLocationList = async (con: string) => {
    try {
      const response = await fetch(
        "https://geocoding-api.open-meteo.com/v1/search?name=" + con
      );
      const data = await response.json();
      const res = data.results;
      if (!res) {
        setLocation([]);
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const myOptions = res.map((contry: any) => {
        return {
          id: contry.id,
          name: contry.name,
          lat: contry.latitude,
          lon: contry.longitude,
        };
      });
      setLocation(myOptions);
      setLocation_data(myOptions[0]);
      localStorage.setItem("weather_location", JSON.stringify(myOptions[0]));
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  const handleInputChange = (_: any, value: string) => {
    getLocationList(value);
  };
  // bg-[#0D9DE3]

  return (
    <div className={`flex flex-col w-screen h-screen app ${bg ? bg : ""}`}>
      {menu && (
        <div className=" absolute flex flex-col self-end ">
          <button
            className={`flex  z-20 justify-center items-center bg-gray-500 opacity-60  drag-all w-[25px] h-[25px] rounded-md m-1  `}
          >
            <RiDragMoveFill className=" text-white" />
          </button>
          <button
            className={`flex z-20 justify-center items-center bg-gray-500 opacity-60 w-[25px] h-[25px] rounded-md m-1`}
            onClick={() => {
              setSercheButton(!sercheButton);
              if (sercheButton && weather_data) {
                // setLocation([]);

                setWeather_data(true);
              }
            }}
          >
            <FaLocationDot className=" text-white" />
          </button>
        </div>
      )}
      {weather_data ? (
        // TODO: add weather data
        <Weather location={location_data} setBg={setBg} />
      ) : (
        <div className="flex w-full justify-center font-medium mt-3">
          <p>Set Location</p>
        </div>
      )}
      {(sercheButton || !weather_data) && (
        <div className="absolute z-10  flex justify-center w-full h-full">
          <Autocomplete
            className={`mr-12 mt-12 w-full ${
              weather_data ? " ml-32" : "ml-12"
            }`}
            freeSolo
            autoComplete
            selectOnFocus
            autoHighlight
            onInputChange={handleInputChange}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options={location.map((country: any) => country.name)}
            renderOption={(props, option, state) => (
              <li {...props} key={state.index}>
                {option}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter") {
                    setWeather_data(true);
                    setSercheButton(false);
                  }
                }}
                onChange={(e) => getLocationList(e.target.value)}
                label="Location"
                color="warning"
                variant="standard"
                autoFocus
              />
            )}
          />
        </div>
      )}
    </div>
  );
}

export default App;
