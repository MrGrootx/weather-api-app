import "./index.css";
import { CiSearch } from "react-icons/ci";

import clearIcon from "./assets/clear.png";
import cloud from "./assets/cloud.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/rain.png";
import snowIcon from "./assets/snow.png";
import windIcon from "./assets/wind.png";
import humidityIcon from "./assets/humidity.png";
import { useEffect, useState } from "react";

import propsTypes from "prop-types";

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  log,
  humidity,
  wind,
}) => {
  return (
    <>
      <div className="text-center h-[150px] mb-10 flex justify-center">
        <img src={icon} alt="Image" className="w-[165px] h-[165px]" />
      </div>
      <div className="mt-5 text-xl text-[#333] uppercase text-center font-bold">
        {temp}°C
      </div>
      <div className="mt-5 text-xl  text-yellow-400 uppercase text-center">
        {city}
      </div>
      <div className="mt-5 text-[#333] uppercase text-center font-bold text-sm">
        {country}
      </div>
      <div className="flex justify-center items-center gap-4 mt-3 text-center">
        <div className="flex flex-col items-center p-5">
          <span>latitude</span>
          <span className="text-sm">{lat}</span>
        </div>

        <div className="flex flex-col items-center p-5">
          <span>logitude</span>
          <span className="text-sm">{log}</span>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="text-center">
          <img src={humidityIcon} alt="humidity" className="w-7  mx-auto" />
          <div>{humidity}%</div>
          <div>Humidity</div>
        </div>
        <div className="text-center">
          <img src={windIcon} alt="Wind" className="w-7  mx-auto" />
          <div>{wind} km/h</div>
          <div>Wind Speed</div>
        </div>
      </div>
    </>
  );
};

function App() {
  const api = "8568b7f0baef32cd1bbd00a3ff7907d6";

  const [text, setText] = useState("Canada");

  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Canada");
  const [country, setCountry] = useState("ES");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(5);

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloud,
    "02n": cloud,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api}&units=Metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();
      // console.log(data);
      if (data.cod === "404") {
        console.log("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconsset = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconsset] || clearIcon);
      setCityNotFound(false);
    } catch (error) {
      console.log(error);
      setError("An error occurred while Fetching weather data!");
    } finally {
      setLoading(false);
    }
  };

  const handlecity = (e) => {
    setText(e.target.value);
  };

  const handlekeydown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(function () {
    search();
  }, []);

  return (
    <section className=" bg-gray-800 xl:w-screen   flex justify-center items-center p-6">
      <div className="md:p-5 p-2 bg-gray-100 rounded shadow-lg ">
        <form className="flex w-full items-center  border border-sky-400 rounded overflow-hidden">
          <input
            type="text"
            placeholder="Search city"
            className="flex-1  border-none text-[16px] p-3 outline-none"
            onChange={handlecity}
            value={text}
            onKeyDown={handlekeydown}
            required
          />
          <div className="px-2 cursor-pointer ">
            <CiSearch className="" onClick={() => search()} />
          </div>
        </form>
        {loading && (
          <div className="mt-4 text-gray-500 font-bold text-center text-xl">
            Loading...
          </div>
        )}
        {error && (
          <div className="mt-4 text-gray-500 font-bold text-center text-xl">
            {error}
          </div>
        )}
        {cityNotFound && (
          <div className="mt-4 text-gray-500 font-bold text-center text-xl">
            City not found
          </div>
        )}
        {!loading && !cityNotFound && !error && (
          <WeatherDetails
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            log={log}
            humidity={humidity}
            wind={wind}
          />
        )}
      </div>
    </section>
  );
}

export default App;

WeatherDetails.propTypes = {
  icon: propsTypes.string.isRequired,
  temp: propsTypes.number.isRequired,
  city: propsTypes.string.isRequired,
  country: propsTypes.string.isRequired,
  humidity: propsTypes.number.isRequired,
  wind: propsTypes.number.isRequired,
  lat: propsTypes.number.isRequired,
  log: propsTypes.number.isRequired,
};
