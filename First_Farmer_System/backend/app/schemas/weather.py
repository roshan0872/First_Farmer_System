from typing import Optional, List
from pydantic import BaseModel


class WeatherForecastItem(BaseModel):
    time: str
    temperature: float
    condition: str
    icon: str
    humidity: int
    rainfall_prob: Optional[float] = 0.0


class WeatherResponse(BaseModel):
    location: str
    country: str
    temperature: float
    feels_like: float
    humidity: int
    wind_speed: float
    precipitation: float
    condition: str
    icon: str
    agricultural_advisory: str
    provider: str
    updated_at: str
    is_sample_data: bool
    notice_message: Optional[str] = None
    forecast: List[WeatherForecastItem] = []
