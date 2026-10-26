from typing import List
from app.models.crop import Crop
from app.schemas.crop import CropResponse
from app.schemas.recommendation import RecommendationRequest, RecommendationMatch, RecommendationResponse


def evaluate_crop_suitability(crop: Crop, req: RecommendationRequest) -> RecommendationMatch:
    score = 0
    max_score = 100
    matched_criteria = []
    unmet_criteria = []
    limitations = []

    # 1. Soil Match (Weight: 30)
    crop_soils = [s.strip().lower() for s in crop.soil_requirements.split(",")]
    user_soil = req.soil_type.strip().lower()
    soil_matched = any(user_soil in s or s in user_soil for s in crop_soils)
    if soil_matched:
        score += 30
        matched_criteria.append(f"Soil Compatibility: {req.soil_type} matches {crop.name}'s requirements ({crop.soil_requirements})")
    else:
        unmet_criteria.append(f"Soil Mismatch: {req.soil_type} is not optimal (ideal: {crop.soil_requirements})")

    # 2. Season Match (Weight: 25)
    crop_seasons = [s.strip().lower() for s in crop.season.split(",")]
    user_season = req.season.strip().lower()
    season_matched = "year-round" in crop_seasons or any(user_season in s or s in user_season for s in crop_seasons)
    if season_matched:
        score += 25
        matched_criteria.append(f"Growing Season: Cultivated in {crop.season}")
    else:
        unmet_criteria.append(f"Season Variation: Preferred season is {crop.season}, but requested for {req.season}")

    # 3. Water Availability Match (Weight: 25)
    water_levels = {"low": 1, "medium": 2, "high": 3}
    crop_water_req = crop.water_requirement.strip().lower()
    user_water_level = req.water_availability.strip().lower()
    c_num = water_levels.get(crop_water_req, 2)
    u_num = water_levels.get(user_water_level, 2)

    if u_num >= c_num:
        score += 25
        matched_criteria.append(f"Water Supply: Current {req.water_availability} availability satisfies {crop.name}'s requirement ({crop.water_requirement})")
    elif u_num == c_num - 1:
        score += 12
        unmet_criteria.append(f"Water Margin: Crop requires {crop.water_requirement} water; supplemental irrigation needed")
    else:
        unmet_criteria.append(f"Water Deficit: Crop requires {crop.water_requirement} water, while availability is {req.water_availability}")

    # 4. Region Match (Weight: 20)
    user_region = req.region.strip().lower()
    crop_regions = [r.strip().lower() for r in crop.suitable_regions.split(",")]
    region_matched = any(user_region in r or r in user_region for r in crop_regions) or "pan-india" in crop.suitable_regions.lower() or "all india" in crop.suitable_regions.lower()
    if region_matched:
        score += 20
        matched_criteria.append(f"Agro-climatic Region: Thrives in {crop.suitable_regions}")
    else:
        score += 8  # Modest compatibility if other conditions match
        unmet_criteria.append(f"Regional Specificity: Primarily cultivated in {crop.suitable_regions}")

    # Optional Temperature check
    if req.temperature is not None:
        if 15.0 <= req.temperature <= 40.0:
            limitations.append(f"Reported temperature {req.temperature}°C is within standard physiological growing limits.")
        else:
            score = max(0, score - 10)
            limitations.append(f"Reported temperature {req.temperature}°C may induce thermal stress.")
    else:
        limitations.append("Local microclimate temperature data was not provided; verify local weather forecasts.")

    # Optional Category filter preference
    if req.preferred_category and req.preferred_category.lower() != "all":
        if req.preferred_category.lower() == crop.category.lower():
            score = min(100, score + 5)
        else:
            score = max(0, score - 15)

    # Classify match level
    if score >= 80:
        match_level = "Highly Recommended"
        explanation = f"{crop.name} shows high compatibility with your {req.soil_type} soil, {req.season} season, and {req.water_availability} water conditions."
    elif score >= 60:
        match_level = "Moderately Suitable"
        explanation = f"{crop.name} is viable with good management and minor soil or irrigation adjustments."
    else:
        match_level = "Conditional"
        explanation = f"{crop.name} may require specialized agricultural inputs, micro-irrigation, or protected nursery cultivation under these conditions."

    return RecommendationMatch(
        crop=CropResponse.model_validate(crop),
        match_score=min(100, max(0, score)),
        match_level=match_level,
        matched_criteria=matched_criteria,
        unmet_or_partial_criteria=unmet_criteria,
        explanation=explanation,
        limitations=limitations,
    )


def get_recommendations(crops: List[Crop], req: RecommendationRequest) -> RecommendationResponse:
    matches: List[RecommendationMatch] = []
    for crop in crops:
        if not crop.is_published:
            continue
        match = evaluate_crop_suitability(crop, req)
        # Filter only crops with at least 35% match score
        if match.match_score >= 35:
            matches.append(match)

    # Sort descending by match_score
    matches.sort(key=lambda m: m.match_score, reverse=True)

    return RecommendationResponse(
        input_summary={
            "region": req.region,
            "soil_type": req.soil_type,
            "season": req.season,
            "water_availability": req.water_availability,
            "temperature": req.temperature,
            "rainfall": req.rainfall,
            "preferred_category": req.preferred_category or "All",
        },
        total_crops_evaluated=len(crops),
        matches=matches,
        educational_disclaimer=(
            "Educational Guidance Only: Recommendations are generated based on published agro-climatic "
            "suitability standards. Actual farm yields depend on variety selection, soil nutrient testing, "
            "timely pest monitoring, and prevailing local microclimates. Consult your local Krishi Vigyan Kendra "
            "(KVK) or agricultural extension officer before planting."
        ),
    )
