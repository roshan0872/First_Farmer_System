from datetime import datetime, timezone
from typing import Optional
import httpx
from app.core.config import settings
from app.schemas.weather import WeatherResponse, WeatherForecastItem


def generate_agricultural_advisory(temp: float, humidity: int, rain: float, wind: float, condition: str) -> str:
    advisories = []
    
    if humidity > 80 and temp > 24:
        advisories.append("High humidity and warm conditions favor fungal pathogens (e.g. blast, blight, downy mildew). Inspect lower leaf surfaces and maintain field drainage.")
    elif humidity < 40 and temp > 32:
        advisories.append("Low humidity and high ambient temperature increase crop evapotranspiration. Schedule drip or furrow irrigation during morning or evening hours to avoid thermal shock.")
    else:
        advisories.append("Current humidity and temperature levels are conducive for standard crop vegetative growth.")

    if wind > 18:
        advisories.append(f"Elevated wind speed ({wind} km/h). Avoid foliar nutrient sprays and pesticide application to prevent chemical drift and uneven coverage.")
    elif wind < 10:
        advisories.append("Calm winds present optimal conditions for field spraying and dusting if needed.")

    if rain > 5:
        advisories.append("Significant precipitation detected/forecasted. Postpone nitrogen top-dressing and pesticide spraying to prevent runoff leaching. Ensure drainage in low-lying plots.")
    elif rain == 0 and temp > 30:
        advisories.append("Dry dry spell: Monitor soil moisture tension in shallow-rooted crops (e.g., vegetables, pulses).")

    return " | ".join(advisories)


async def get_weather_data(location: str = "Coimbatore") -> WeatherResponse:
    api_key = settings.OPENWEATHER_API_KEY.strip() if settings.OPENWEATHER_API_KEY else ""

    if api_key:
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                # OpenWeather Current Weather
                url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&units=metric&appid={api_key}"
                res = await client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    temp = float(data["main"]["temp"])
                    feels_like = float(data["main"]["feels_like"])
                    humidity = int(data["main"]["humidity"])
                    wind_speed = float(data["wind"]["speed"] * 3.6)  # m/s to km/h
                    rain = float(data.get("rain", {}).get("1h", 0.0))
                    condition = data["weather"][0]["main"]
                    icon = data["weather"][0]["icon"]

                    # Fetch 5-day forecast
                    forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={location}&units=metric&cnt=5&appid={api_key}"
                    forecast_res = await client.get(forecast_url)
                    forecast_items = []
                    if forecast_res.status_code == 200:
                        fdata = forecast_res.json()
                        for item in fdata.get("list", []):
                            forecast_items.append(
                                WeatherForecastItem(
                                    time=item["dt_txt"],
                                    temperature=float(item["main"]["temp"]),
                                    condition=item["weather"][0]["main"],
                                    icon=item["weather"][0]["icon"],
                                    humidity=int(item["main"]["humidity"]),
                                    rainfall_prob=float(item.get("pop", 0.0) * 100),
                                )
                            )

                    advisory = generate_agricultural_advisory(temp, humidity, rain, wind_speed, condition)

                    return WeatherResponse(
                        location=data.get("name", location),
                        country=data.get("sys", {}).get("country", "IN"),
                        temperature=temp,
                        feels_like=feels_like,
                        humidity=humidity,
                        wind_speed=wind_speed,
                        precipitation=rain,
                        condition=condition,
                        icon=icon,
                        agricultural_advisory=advisory,
                        provider="OpenWeather Live API",
                        updated_at=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
                        is_sample_data=False,
                        notice_message=None,
                        forecast=forecast_items,
                    )
        except Exception:
            # Fall through to explicit educational sample with clear error explanation
            pass

    # Explicit Fallback Educational Sample Data
    loc_clean = location.capitalize() if location else "Coimbatore"
    sample_temp = 28.5
    sample_humidity = 72
    sample_wind = 12.0
    sample_rain = 0.5
    sample_condition = "Partly Cloudy"

    sample_forecast = [
        WeatherForecastItem(time="Today 15:00", temperature=29.0, condition="Clouds", icon="03d", humidity=68, rainfall_prob=15.0),
        WeatherForecastItem(time="Today 18:00", temperature=27.2, condition="Clear", icon="01d", humidity=74, rainfall_prob=10.0),
        WeatherForecastItem(time="Tomorrow 06:00", temperature=22.5, condition="Mist", icon="50d", humidity=85, rainfall_prob=20.0),
        WeatherForecastItem(time="Tomorrow 12:00", temperature=30.4, condition="Sunny", icon="01d", humidity=62, rainfall_prob=5.0),
        WeatherForecastItem(time="Tomorrow 18:00", temperature=26.8, condition="Rain", icon="10d", humidity=80, rainfall_prob=65.0),
    ]

    return WeatherResponse(
        location=loc_clean,
        country="IN",
        temperature=sample_temp,
        feels_like=30.1,
        humidity=sample_humidity,
        wind_speed=sample_wind,
        precipitation=sample_rain,
        condition=sample_condition,
        icon="02d",
        agricultural_advisory=generate_agricultural_advisory(sample_temp, sample_humidity, sample_rain, sample_wind, sample_condition),
        provider="Offline Educational Simulator",
        updated_at=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
        is_sample_data=True,
        notice_message="Live Weather API key is not configured in backend/.env (OPENWEATHER_API_KEY). Showing educational agricultural simulation for demonstration.",
        forecast=sample_forecast,
    )
