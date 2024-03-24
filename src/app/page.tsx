/**@format */
"use client";
import Container from "@/components/Container";
import ForecastWeatherDetails from "@/components/ForecastWeatherDetails";
import Navbar from "@/components/Navbar";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherIcon from "@/components/WeatherIcon";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { metersToKilometers } from "@/utils/metersToKilometers";
import axios from "axios";
import { format, fromUnixTime } from "date-fns";
import { parseISO } from "date-fns/parseISO";
import { useAtom } from "jotai";
// import Image from "next/image";
import { useQuery } from "react-query";
import { placeAtom } from "./atom";
import { useEffect } from "react";

interface MainWeatherInfo {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
}

interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

interface Clouds {
    all: number;
}

interface Wind {
    speed: number;
    deg: number;
    gust: number;
}

interface Sys {
    pod: string;
}

interface List {
    dt: number;
    main: MainWeatherInfo;
    weather: Weather[];
    clouds: Clouds;
    wind: Wind;
    visibility: number;
    pop: number;
    sys: Sys;
    dt_txt: string;
}

interface City {
    id: number;
    name: string;
    coord: {
        lat: number;
        lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
}

interface WeatherData {
    cod: string;
    message: number;
    cnt: number;
    list: List[];
    city: City;
}

export default function Home() {
    const [place, setPlace] = useAtom(placeAtom);

    const { isLoading, error, data, refetch } = useQuery<WeatherData>({
        queryKey: ["repoData"],
        queryFn: async () => {
            const { data } = await axios.get(
                `http://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
            );
            return data;
        },
    });

    useEffect(() => {
        refetch();
    }, [place, refetch]);

    const firstData = data?.list[0];
    // console.log(firstData);

    const uniqueDates = [
        ...new Set(
            data?.list.map(
                (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
            )
        ),
    ];

    const firstDataForEachDate = uniqueDates.map((date) => {
        return data?.list.find((entry) => {
            const entryDate = new Date(entry.dt * 1000)
                .toISOString()
                .split("T")[0];
            const entryTime = new Date(entry.dt * 1000).getHours();
            return entryDate === date && entryTime >= 6;
        });
    });

    console.log(firstDataForEachDate);

    if (isLoading) {
        return (
            <div className="flex items-center min-h-screen justify-center">
                <p className="animate-bounce">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
            <Navbar />
            <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4 ">
                {/*Today's data*/}
                <section className="space-y-4">
                    <div>
                        <h2 className="flex gap-1 text-2xl items-end">
                            <p>
                                {format(
                                    parseISO(firstData?.dt_txt ?? ""),
                                    "EEEE"
                                )}
                            </p>
                            <p className="text-gray-600 text-sm">
                                {format(
                                    parseISO(firstData?.dt_txt ?? ""),
                                    "dd/MM/yyyy"
                                )}
                            </p>
                        </h2>
                        <Container className=" gap-10 px-6 items-center">
                            <div className=" flex flex-col px-4 ">
                                <span className="text-5xl">
                                    {convertKelvinToCelsius(
                                        firstData?.main.temp ?? 0
                                    )}
                                    °
                                </span>
                                <p className="text-xs space-x-1 whitespace-nowrap">
                                    <span>Feels like</span>
                                    <span>
                                        {convertKelvinToCelsius(
                                            firstData?.main.feels_like ?? 0
                                        )}
                                        °
                                    </span>
                                </p>
                                <p className="text-xs space-x-2">
                                    <span>
                                        {convertKelvinToCelsius(
                                            firstData?.main.temp_min ?? 0
                                        )}
                                        °↓
                                    </span>
                                    <span>
                                        {convertKelvinToCelsius(
                                            firstData?.main.temp_max ?? 0
                                        )}
                                        °↑
                                    </span>
                                </p>
                            </div>
                            {/* time and weather icon */}
                            <div className="flex gap-10 sm:gap-15 overflow-x-auto w-full justify-between pr-3">
                                {data?.list.map((d, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col justify-center text-xs font-semibold "
                                    >
                                        <p className="whitespace-nowrap">
                                            {format(
                                                parseISO(d.dt_txt),
                                                "h:mm a"
                                            )}
                                        </p>
                                        <WeatherIcon
                                            iconname={getDayOrNightIcon(
                                                d.weather[0].icon,
                                                d.dt_txt
                                            )}
                                        />
                                        <p>
                                            {convertKelvinToCelsius(
                                                d?.main.temp ?? 0
                                            )}
                                            °
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Container>
                    </div>
                    <div className="flex gap-4">
                        {/*Left*/}
                        <Container className="w-fit justify-center flex-col px-4 items-center ">
                            <p className="capitalize text-center">
                                {firstData?.weather[0].description}
                            </p>
                            <WeatherIcon
                                iconname={getDayOrNightIcon(
                                    firstData?.weather[0].icon ?? "",
                                    firstData?.dt_txt ?? ""
                                )}
                            />
                        </Container>
                        {/*Right*/}
                        <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
                            <WeatherDetails
                                visibility={metersToKilometers(
                                    firstData?.visibility ?? 10000
                                )}
                                airPressure={`${firstData?.main.pressure} hPa`}
                                humidity={`${firstData?.main.humidity}%`}
                                sunRise={format(
                                    fromUnixTime(
                                        data?.city.sunrise ?? 1702949452
                                    ),
                                    "H:mm"
                                )}
                                sunSet={format(
                                    fromUnixTime(
                                        data?.city.sunset ?? 1702949452
                                    ),
                                    "H:mm"
                                )}
                                windSpeed={convertWindSpeed(
                                    firstData?.wind.speed ?? 1.64
                                )}
                            />
                        </Container>
                    </div>
                </section>
                {/*7 day's forcast data*/}
                <section className="flex w-full flex-col gap-4 ">
                    <p className="text-2xl">Forecast (7 days)</p>
                    {firstDataForEachDate.map((d, i) => (
                        <ForecastWeatherDetails
                            key={i}
                            description={d?.weather[0].description ?? ""}
                            weatherIcon={d?.weather[0].icon ?? "01d"}
                            date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
                            day={
                                d ? format(parseISO(d.dt_txt), "dd.MM") : "EEEE"
                            }
                            feels_like={d?.main.feels_like ?? 0}
                            temp={d?.main.temp ?? 0}
                            temp_max={d?.main.temp_max ?? 0}
                            temp_min={d?.main.temp_min ?? 0}
                            airPressure={`${d?.main.pressure} hPa `}
                            humidity={`${d?.main.humidity}% `}
                            sunRise={format(
                                fromUnixTime(data?.city.sunrise ?? 1702517657),
                                "H:mm"
                            )}
                            sunSet={format(
                                fromUnixTime(data?.city.sunset ?? 1702517657),
                                "H:mm"
                            )}
                            visibility={`${metersToKilometers(
                                d?.visibility ?? 10000
                            )} `}
                            windSpeed={`${convertWindSpeed(
                                d?.wind.speed ?? 1.64
                            )} `}
                        />
                    ))}
                </section>
            </main>
        </div>
    );
}
