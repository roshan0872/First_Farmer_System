import re
import uuid
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from app.models.crop import Crop
from app.models.guides import CultivationGuide, PestDisease, HarvestGuide, PostHarvestGuide, CropProduct
from app.models.chat import ChatMessage
from app.schemas.chatbot import ChatRequest, ChatResponse, RelatedLink
from app.core.config import settings


def find_best_crop_match(db: Session, text: str) -> Optional[Crop]:
    crops = db.query(Crop).all()
    text_lower = text.lower()
    for crop in crops:
        if crop.name.lower() in text_lower or (crop.scientific_name and crop.scientific_name.lower() in text_lower):
            return crop
    return None


def has_word(text: str, keywords: List[str]) -> bool:
    for kw in keywords:
        # If keyword is multiple words or non-ascii, check substring or boundary
        if " " in kw or any(ord(c) > 127 for c in kw):
            if kw in text:
                return True
        else:
            if re.search(r'\b' + re.escape(kw) + r'\b', text, re.IGNORECASE):
                return True
    return False


def get_retrieval_response(db: Session, user_query: str, lang: str = "en") -> Tuple[str, Optional[str], List[RelatedLink]]:
    q = user_query.lower().strip()
    related_links: List[RelatedLink] = []

    # Greetings / System questions
    if has_word(q, ["hello", "hi", "vanakkam", "namaste", "hey", "greetings"]):
        if lang == "ta":
            return (
                "வணக்கம்! நான் ஃபர்ஸ்ட் ஃபார்மர் வேளாண்மை வழிகாட்டி உதவியாளர். பயிர் சாகுபடி, பூச்சி மற்றும் நோய் கட்டுப்பாடு, அறுவடை, மதிப்புக்கூட்டு பொருட்கள் பற்றி நீங்கள் கேட்கலாம்.",
                "greeting",
                [RelatedLink(title="பயிர்கள் நூலகம்", url="/crops"), RelatedLink(title="பயிர் பரிந்துரை", url="/recommendations")]
            )
        elif lang == "hi":
            return (
                "नमस्ते! मैं फर्स्ट फार्मर कृषि शिक्षण सहायक हूँ। आप फसलों की खेती, कीट एवं रोग नियंत्रण, कटाई और मूल्य संवर्धन उत्पादों के बारे में पूछ सकते हैं।",
                "greeting",
                [RelatedLink(title="फसल पुस्तकालय", url="/crops"), RelatedLink(title="फसल सिफारिश", url="/recommendations")]
            )
        return (
            "Hello! I am your First Farmer Agriculture Assistant. You can ask me questions about crop selection, cultivation practices, pest and disease management, harvesting, post-harvest processing, and value-added agricultural products.",
            "greeting",
            [RelatedLink(title="Crop Library", url="/crops"), RelatedLink(title="Crop Recommendation", url="/recommendations")]
        )

    # Detect specific crop if mentioned
    matched_crop = find_best_crop_match(db, q)

    # Check for Pest & Disease questions
    if has_word(q, ["pest", "disease", "fungus", "blight", "rot", "insects", "damage", "worm", "பூச்சி", "நோய்", "कीट", "रोग"]):
        if matched_crop:
            pests = db.query(PestDisease).filter(PestDisease.crop_id == matched_crop.id).all()
            if pests:
                items_str = "\n".join([f"• **{p.name}** ({p.type}): Symptoms: {p.symptoms[:120]}... Prevention: {p.prevention[:120]}..." for p in pests[:3]])
                reply = (
                    f"Common pests and diseases affecting **{matched_crop.name}** include:\n\n{items_str}\n\n"
                    f"*Note: For chemical or biological dosages, always consult local university extension officers or KVK.*"
                )
                related_links.append(RelatedLink(title=f"{matched_crop.name} Health Guide", url=f"/pests-diseases?crop_id={matched_crop.id}"))
                related_links.append(RelatedLink(title=f"{matched_crop.name} Details", url=f"/crops/{matched_crop.id}"))
                return reply, "pest_disease", related_links

        all_pests = db.query(PestDisease).limit(4).all()
        pest_list = ", ".join([p.name for p in all_pests])
        return (
            f"We have detailed educational pest & disease management guides for major agricultural crops (including {pest_list}). "
            f"Specify a crop name (e.g. 'pests in tomato' or 'rice diseases') or visit our Pest and Disease Guide.",
            "pest_disease",
            [RelatedLink(title="Pest & Disease Guide", url="/pests-diseases")]
        )

    # Check for Post-Harvest and Value-Added Products
    if has_word(q, ["post harvest", "value added", "product", "processing", "by-product", "storage", "sauce", "chips", "oil", "jaggery", "மதிப்புக்கூட்டு", "பதப்படுத்துதல்", "मूल्य संवर्धन", "उत्पाद"]):
        if matched_crop:
            prods = db.query(CropProduct).filter(CropProduct.crop_id == matched_crop.id).all()
            ph_guide = db.query(PostHarvestGuide).filter(PostHarvestGuide.crop_id == matched_crop.id).first()
            if prods:
                p_text = "\n".join([f"• **{p.product_name}** ({p.product_category}): {p.processing_overview[:120]}..." for p in prods[:3]])
                storage = f"\n\n**Storage Practice:** {ph_guide.storage_method[:150]}..." if ph_guide else ""
                reply = (
                    f"Value-added products and post-harvest opportunities for **{matched_crop.name}**:\n\n{p_text}{storage}\n\n"
                    f"These processing methods help reduce post-harvest losses and enhance farm gate realization."
                )
                related_links.append(RelatedLink(title=f"{matched_crop.name} Value Addition", url=f"/post-harvest?crop_id={matched_crop.id}"))
                related_links.append(RelatedLink(title=f"{matched_crop.name} Cultivation", url=f"/cultivation/{matched_crop.id}"))
                return reply, "value_addition", related_links

        all_prods = db.query(CropProduct).limit(5).all()
        prod_names = ", ".join([p.product_name for p in all_prods])
        return (
            f"Post-harvest processing turns raw farm produce into shelf-stable, value-added goods. Examples in our database include: {prod_names}. "
            f"Search by crop name to see step-by-step processing, storage protocols, and industrial uses.",
            "value_addition",
            [RelatedLink(title="Post-Harvest & Value Addition Guide", url="/post-harvest")]
        )

    # Check for Harvesting questions
    if has_word(q, ["harvest", "maturity", "reap", "cutting", "picking", "அறுவடை", "कटाई"]):
        if matched_crop:
            hg = db.query(HarvestGuide).filter(HarvestGuide.crop_id == matched_crop.id).first()
            if hg:
                reply = (
                    f"**Harvesting Guide for {matched_crop.name}:**\n\n"
                    f"• **Maturity Indicators:** {hg.maturity_indicators}\n"
                    f"• **Harvest Timing:** {hg.approximate_harvest_period}\n"
                    f"• **Method:** {hg.harvesting_method}\n"
                    f"• **Precautions:** {hg.handling_precautions}"
                )
                related_links.append(RelatedLink(title=f"{matched_crop.name} Harvest Details", url=f"/harvesting?crop_id={matched_crop.id}"))
                return reply, "harvesting", related_links

        return (
            "Optimal harvest timing is essential to achieve high grain/fruit quality. Specify a crop like 'harvesting rice' or 'harvesting tomato' for exact maturity indicators.",
            "harvesting",
            [RelatedLink(title="Harvesting Guide", url="/harvesting")]
        )

    # Check for Cultivation / Sowing / Soil / Fertilizer questions
    if has_word(q, ["grow", "cultivation", "cultivate", "plant", "sow", "soil", "fertilizer", "water", "irrigation", "விதைப்பு", "உரம்", "பாசனம்", "बुवाई", "सिंचाई", "उर्वरक"]):
        if matched_crop:
            cg = db.query(CultivationGuide).filter(CultivationGuide.crop_id == matched_crop.id).first()
            if cg:
                reply = (
                    f"**Cultivation Guide for {matched_crop.name}**:\n\n"
                    f"• **Soil Requirement:** {matched_crop.soil_requirements}\n"
                    f"• **Season & Climate:** {matched_crop.season} ({matched_crop.climate_requirements})\n"
                    f"• **Land Preparation:** {cg.land_preparation[:150]}...\n"
                    f"• **Sowing:** {cg.sowing_method[:150]}...\n"
                    f"• **Irrigation:** {cg.irrigation[:150]}...\n"
                    f"• **Nutrients:** {cg.nutrient_management[:150]}..."
                )
                related_links.append(RelatedLink(title=f"{matched_crop.name} Step-by-Step Guide", url=f"/cultivation/{matched_crop.id}"))
                related_links.append(RelatedLink(title="View Full Crop Profile", url=f"/crops/{matched_crop.id}"))
                return reply, "cultivation", related_links

    # If crop is mentioned without specific topic, give general overview
    if matched_crop:
        reply = (
            f"**{matched_crop.name}** (*{matched_crop.scientific_name}*):\n\n"
            f"{matched_crop.description}\n\n"
            f"• **Category:** {matched_crop.category}\n"
            f"• **Optimal Season:** {matched_crop.season}\n"
            f"• **Soil:** {matched_crop.soil_requirements}\n"
            f"• **Water Need:** {matched_crop.water_requirement} | **Difficulty:** {matched_crop.difficulty_level}"
        )
        related_links.append(RelatedLink(title=f"{matched_crop.name} Overview", url=f"/crops/{matched_crop.id}"))
        related_links.append(RelatedLink(title="Cultivation Details", url=f"/cultivation/{matched_crop.id}"))
        related_links.append(RelatedLink(title="Post-Harvest Products", url=f"/post-harvest?crop_id={matched_crop.id}"))
        return reply, "crop_overview", related_links

    # Crop recommendation inquiry
    if has_word(q, ["recommend", "recommendation", "suggest", "suggestion", "பரிந்துரை", "सिफारिश"]):
        return (
            "To get tailored crop recommendations based on your soil type, season, region, and water availability, "
            "please use our Crop Recommendation tool. It evaluates agro-climatic parameters using verified suitability models.",
            "recommendation",
            [RelatedLink(title="Try Crop Recommendation", url="/recommendations")]
        )

    # Weather inquiry
    if has_word(q, ["weather", "rain", "temperature", "forecast", "climate", "வானிலை", "मौसम"]):
        return (
            "Weather conditions directly govern agricultural operations like spraying, irrigation, and harvesting. "
            "Check our Weather page for real-time agricultural advisories.",
            "weather",
            [RelatedLink(title="View Weather Advisories", url="/weather")]
        )

    # Honest Fallback
    crops_sample = db.query(Crop).limit(5).all()
    crops_text = ", ".join([c.name for c in crops_sample])
    if lang == "ta":
        fallback_msg = (
            f"மன்னிக்கவும், உங்கள் கேள்விக்கான சரியான தகவல் கிடைக்கவில்லை. "
            f"நீங்கள் {crops_text} போன்ற பயிர்களின் சாகுபடி, பூச்சிகள், அறுவடை, அல்லது மதிப்புக்கூட்டு பொருட்கள் பற்றி கேட்கலாம்."
        )
    elif lang == "hi":
        fallback_msg = (
            f"क्षमा करें, इस प्रश्न के लिए डेटाबेस में सटीक जानकारी नहीं मिली। "
            f"आप {crops_text} जैसी फसलों की खेती, कीट प्रबंधन, कटाई या मूल्य संवर्धन के बारे में पूछ सकते हैं।"
        )
    else:
        fallback_msg = (
            f"I could not locate a verified match in our agricultural database for your specific question. "
            f"I can provide detailed guidance on crops such as {crops_text}, including cultivation practices, "
            f"pest identification, harvesting maturity, and post-harvest value addition. Please try asking about a specific crop or agricultural phase."
        )

    return (
        fallback_msg,
        None,
        [RelatedLink(title="Explore Crop Library", url="/crops"), RelatedLink(title="Crop Recommendation Tool", url="/recommendations")]
    )


async def process_chat_message(db: Session, req: ChatRequest, user_id: Optional[int] = None) -> ChatResponse:
    conv_id = req.conversation_id or str(uuid.uuid4())

    # Log user message
    user_msg = ChatMessage(
        user_id=user_id,
        conversation_id=conv_id,
        role="user",
        message_text=req.message,
    )
    db.add(user_msg)
    db.commit()

    reply, matched_topic, related_links = get_retrieval_response(db, req.message, lang=req.language or "en")

    # Log assistant response
    assistant_msg = ChatMessage(
        user_id=user_id,
        conversation_id=conv_id,
        role="assistant",
        message_text=reply,
    )
    db.add(assistant_msg)
    db.commit()

    return ChatResponse(
        reply=reply,
        conversation_id=conv_id,
        matched_topic=matched_topic,
        related_links=related_links,
        is_ai_generated=False,
        source_attribution="First Farmer Agricultural Knowledge Database (ICAR / SAU Agronomy Guidelines)",
    )
