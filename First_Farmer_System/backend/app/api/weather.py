from typing import Optional
from fastapi import APIRouter, Query
from app.schemas.weather import WeatherResponse
from app.services.weather_service import get_weather_data

router = APIRouter(prefix="/weather", tags=["Weather"])


@router.get("", response_model=WeatherResponse)
async def get_weather(
    location: Optional[str] = Query("Coimbatore", description="City or district name for weather conditions and forecast")
):
    clean_location = location.strip() if location else "Coimbatore"
    return await get_weather_data(clean_location)
