/**@format */
import React from "react";
import { FiDroplet } from "react-icons/fi";
import { ImMeter } from "react-icons/im";
import { LuEye, LuSunrise, LuSunset } from "react-icons/lu";
import { MdAir } from "react-icons/md";

export interface WeatherDetailProps {
    visibility: string;
    humidity: string;
    windSpeed: string;
    airPressure: string;
    sunRise: string;
    sunSet: string;
}

export default function WeatherDetails(props: WeatherDetailProps) {
    const {
        visibility = "25km",
        humidity = "61%",
        windSpeed = "7 km/h",
        airPressure = "1012 hPa",
        sunRise = "6:20",
        sunSet = "18:48",
    } = props;
    return (
        <>
            <SingleWeatherDetails
                icon={<LuEye />}
                information="Visibility"
                value={visibility}
            />
            <SingleWeatherDetails
                icon={<FiDroplet />}
                information="Humidity"
                value={humidity}
            />
            <SingleWeatherDetails
                icon={<MdAir />}
                information="Wind Speed"
                value={windSpeed}
            />
            <SingleWeatherDetails
                icon={<ImMeter />}
                information="Air Pressure"
                value={airPressure}
            />
            <SingleWeatherDetails
                icon={<LuSunrise />}
                information="Sun Rise"
                value={sunRise}
            />
            <SingleWeatherDetails
                icon={<LuSunset />}
                information="Sun Set"
                value={sunSet}
            />
        </>
    );
}

export interface SingleWeathrDetailProps {
    information: string;
    icon: React.ReactNode;
    value: string;
}

function SingleWeatherDetails(props: SingleWeathrDetailProps) {
    return (
        <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80">
            <p className="whitespace-nowrap">{props.information}</p>
            <div className="text-3xl">{props.icon}</div>
            <p>{props.value}</p>
        </div>
    );
}
