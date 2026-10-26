from app.schemas.auth import (
    UserRegister,
    UserLogin,
    PasswordChange,
    UserUpdate,
    UserResponse,
    Token,
    TokenPayload,
)
from app.schemas.crop import (
    CropBase,
    CropCreate,
    CropUpdate,
    CropResponse,
    CropDetailResponse,
    CropFilterParams,
)
from app.schemas.guides import (
    CultivationGuideBase,
    CultivationGuideCreate,
    CultivationGuideResponse,
    PestDiseaseBase,
    PestDiseaseCreate,
    PestDiseaseResponse,
    HarvestGuideBase,
    HarvestGuideCreate,
    HarvestGuideResponse,
    PostHarvestGuideBase,
    PostHarvestGuideCreate,
    PostHarvestGuideResponse,
    CropProductBase,
    CropProductCreate,
    CropProductResponse,
)
from app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationMatch,
    RecommendationResponse,
)
from app.schemas.learning import (
    BookmarkResponse,
    ProgressCreate,
    ProgressResponse,
    LearningDashboardStats,
)
from app.schemas.weather import WeatherResponse, WeatherForecastItem
from app.schemas.chatbot import ChatRequest, ChatResponse, RelatedLink, ChatHistoryItem
from app.schemas.admin import AdminStatsResponse
