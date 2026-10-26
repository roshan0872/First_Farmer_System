"""
Database seed script for First Farmer Agriculture System.
Populates verified educational agricultural data for 10 representative crops,
complete cultivation guides, pest/disease management protocols, harvesting practices,
post-harvest value addition products, and initial demo accounts.
"""
import sys

# Ensure UTF-8 output encoding on Windows consoles
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from app.db.session import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.user import User
from app.models.crop import Crop
from app.models.guides import (
    CultivationGuide,
    PestDisease,
    HarvestGuide,
    PostHarvestGuide,
    CropProduct,
)
import app.models  # Register models


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        print("[INFO] Seeding Users...")
        # 1. Admin User
        admin_user = db.query(User).filter(User.email == "admin@firstfarmer.org").first()
        if not admin_user:
            admin_user = User(
                full_name="Agriculture Administrator",
                email="admin@firstfarmer.org",
                password_hash=get_password_hash("Admin@123"),
                role="admin",
                preferred_language="en",
            )
            db.add(admin_user)
            print("  [+] Created Admin: admin@firstfarmer.org")

        # 2. Student User
        student_user = db.query(User).filter(User.email == "student@firstfarmer.org").first()
        if not student_user:
            student_user = User(
                full_name="Kisan Vidyarthi",
                email="student@firstfarmer.org",
                password_hash=get_password_hash("Student@123"),
                role="student",
                preferred_language="en",
            )
            db.add(student_user)
            print("  [+] Created Student: student@firstfarmer.org")

        db.commit()

        # 10 Crops Dataset
        crops_data = [
            {
                "name": "Rice",
                "scientific_name": "Oryza sativa",
                "category": "Cereal",
                "description": "Rice is the primary staple food for over half the world's population, especially across Asia. It is semi-aquatic and thrives under warm, humid conditions with abundant water availability.",
                "suitable_regions": "South India, East India, Coastal Plains, Indo-Gangetic Plains",
                "soil_requirements": "Clay, Clay Loam, Alluvial",
                "climate_requirements": "Warm, humid climate; 20°C - 35°C; abundant rainfall (>1000 mm)",
                "season": "Kharif",
                "water_requirement": "High",
                "difficulty_level": "Beginner",
                "image_path": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80",
                "cultivation": {
                    "land_preparation": "Puddle soil thoroughly by 2-3 ploughings followed by flooding with 5-10 cm water. Level with a wooden plank to maintain uniform standing water.",
                    "seed_selection": "Select certified disease-free seeds (e.g. BPT 5204, IR 64). Perform salt-water floatation test to eliminate unfilled grains.",
                    "sowing_method": "Nursery bed raising followed by transplanting 20-25 day old seedlings at 2-3 seedlings per hill, spaced 20x15 cm.",
                    "irrigation": "Maintain 2-5 cm standing water during tillering and flowering. Drain field 7-10 days before harvesting.",
                    "nutrient_management": "Apply Farmyard Manure (FYM) 10-12 t/ha during last ploughing. Standard NPK 120:40:40 kg/ha with Nitrogen applied in 3 splits.",
                    "weed_management": "Hand weeding at 20 and 40 days after transplanting (DAT) or use cono-weeder under SRI method.",
                    "growth_stages": "Germination (1-3 d) -> Seedling (15-25 d) -> Tillering (30-50 d) -> Panicle Initiation (60-70 d) -> Flowering/Milking (80-95 d) -> Maturity (110-135 d)",
                    "beginner_mistakes": "Excessive standing water in early seedling stage; delayed transplanting exceeding 30 days resulting in low tillering."
                },
                "pests": [
                    {
                        "name": "Rice Blast",
                        "type": "Disease",
                        "symptoms": "Spindle-shaped lesions with greyish center and dark brown margin on leaf blades and neck rot of panicles.",
                        "conditions": "High relative humidity (>90%), dew, intermittent drizzle, and excess nitrogen fertilizer.",
                        "prevention": "Seed treatment with Trichoderma viride (10g/kg) or Pseudomonas fluorescens; avoid excess nitrogen application.",
                        "management": "Spray Tricyclazole 75 WP @ 0.6 g/L or Azoxystrobin @ 1 ml/L at early infection onset.",
                        "source_reference": "ICAR-National Rice Research Institute (NRRI) Diagnostic Bulletin",
                        "last_reviewed_at": "2026-03-15"
                    },
                    {
                        "name": "Brown Plant Hopper (BPH)",
                        "type": "Pest",
                        "symptoms": "Yellowing and drying of plants in circular patches ('hopper burn') caused by phloem sap suction at base of tillers.",
                        "conditions": "Dense canopy, close planting, excessive urea application, and humid microclimate.",
                        "prevention": "Form alleyways (30 cm every 2-3 meters) for aeration; avoid close planting and conserve predatory spiders.",
                        "management": "Drain water from the field for 3-4 days. Apply Neem seed kernel extract (NSKE 5%) or Pymetrozine 50 WG @ 0.6 g/L directed at stem base.",
                        "source_reference": "Tamil Nadu Agricultural University (TNAU) Agritech Portal",
                        "last_reviewed_at": "2026-04-10"
                    }
                ],
                "harvest": {
                    "maturity_indicators": "Over 80-85% of grains in the panicle turn golden yellow, and grain moisture drops to 20-22%.",
                    "approximate_harvest_period": "110 to 140 days after sowing (depending on variety)",
                    "harvesting_method": "Cut plants with serrated sickles 10 cm above ground level or use combine harvester.",
                    "handling_precautions": "Thresh within 2-3 days of harvest to prevent mold growth and discolouration.",
                    "storage_preparation": "Sun dry the paddy until moisture is reduced to 12-14% before bagging in jute or hermetic bags."
                },
                "post_harvest": {
                    "cleaning_and_grading": "Pre-cleaning with oscillating sieves and aspirator blowers to separate chaff, straw, and immature grains.",
                    "storage_method": "Store in clean, moisture-proof warehouses on wooden pallets away from damp walls.",
                    "preservation_method": "Maintain safe moisture (<13%) and treat godowns with malathion/deltamethrin surface barrier sprays.",
                    "processing_method": "Parboiling (soaking, steaming, drying) followed by modern de-husking and polisher mills.",
                    "packaging_method": "Food-grade HDPE woven bags or vacuum sealed multilayer pouches for retail rice.",
                    "food_uses": "Table rice, idli/dosa batter, flattened rice (poha), puffed rice, rice vermicelli.",
                    "industrial_uses": "Rice starch for textiles and pharmaceuticals, brewing adjuncts.",
                    "by_products": "Rice husk (boiler fuel, silica extraction), Rice bran (edible oil, animal feed)."
                },
                "products": [
                    {
                        "product_name": "Cold-Pressed Rice Bran Oil",
                        "product_category": "Food & Health",
                        "raw_material": "Freshly milled rice bran",
                        "processing_overview": "Extracted from outer brown layer of rice kernel and physically refined to retain high Oryzanol content.",
                        "common_uses": "Healthy high-smoke-point cooking oil, heart-healthy dietary supplement.",
                        "storage_considerations": "Store in opaque tin containers or food grade PET bottles in cool dark area.",
                        "potential_value_addition": "Raw bran sells at ₹15-20/kg, while refined Oryzanol-rich oil fetches ₹140-180/L."
                    },
                    {
                        "product_name": "Fortified Rice Flour & Poha",
                        "product_category": "Food",
                        "raw_material": "Paddy / milled rice grains",
                        "processing_overview": "Cleaned paddy is parboiled, flattened between heavy rollers into flakes, dried and packaged.",
                        "common_uses": "Traditional breakfast foods, extruded snacks, gluten-free baking blends.",
                        "storage_considerations": "Moisture-proof pouches; shelf life 6 months in dry ambient storage.",
                        "potential_value_addition": "Flaking increases raw grain value by 60% with simple rural processing equipment."
                    }
                ]
            },
            {
                "name": "Wheat",
                "scientific_name": "Triticum aestivum",
                "category": "Cereal",
                "description": "Wheat is the dominant winter (Rabi) staple cereal of northern and central India, famous for gluten that enables dough elasticity for chapati and bread making.",
                "suitable_regions": "North India, Central India, Indo-Gangetic Plains",
                "soil_requirements": "Alluvial, Loamy, Clay Loam",
                "climate_requirements": "Cool winter growing season (10°C - 15°C) followed by bright warm ripening period (20°C - 25°C)",
                "season": "Rabi",
                "water_requirement": "Medium",
                "difficulty_level": "Beginner",
                "image_path": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
                "cultivation": {
                    "land_preparation": "Plough 2-3 times with cultivator followed by harrowing to produce a fine, pulverized seedbed free of clods.",
                    "seed_selection": "Use rust-resistant varieties like HD 2967, PBW 550, or GW 322 treated with Carboxin.",
                    "sowing_method": "Line sowing with seed-cum-fertilizer drill at 20-22 cm row spacing at 4-5 cm depth during first fortnight of November.",
                    "irrigation": "Critical irrigation stages: Crown Root Initiation (CRI at 21 DAS), Tillering (40-45 DAS), Jointing, Booting, and Grain Filling.",
                    "nutrient_management": "Apply 120 kg N, 60 kg P2O5, 40 kg K2O per hectare. Half N with all P and K at basal sowing; remaining N topdressed at CRI and tillering.",
                    "weed_management": "Spray Sulfosulfuron 75 WG @ 33 g/ha at 30-35 DAS for control of Phalaris minor and broadleaf weeds.",
                    "growth_stages": "Germination (4-7 d) -> Crown Root (20-25 d) -> Tillering (35-50 d) -> Jointing (60-70 d) -> Heading (80-90 d) -> Dough stage (105-120 d) -> Maturity (130-145 d)",
                    "beginner_mistakes": "Delaying the first irrigation beyond 25 DAS halts crown root initiation and drastically reduces yield."
                },
                "pests": [
                    {
                        "name": "Yellow / Stripe Rust",
                        "type": "Disease",
                        "symptoms": "Linear yellow pustules arranged in stripes on leaves that burst to release powdery spores.",
                        "conditions": "Cool temperatures (10-15°C) accompanied by high humidity or night dews.",
                        "prevention": "Grow recommended rust-resistant varieties; avoid excessive late nitrogen.",
                        "management": "Spray Propiconazole 25 EC @ 1 ml/L at first appearance of yellow stripes.",
                        "source_reference": "ICAR-Indian Institute of Wheat and Barley Research (IIWBR)",
                        "last_reviewed_at": "2026-02-18"
                    }
                ],
                "harvest": {
                    "maturity_indicators": "Straw and spikes turn golden yellow; grain becomes hard and snaps cleanly under teeth (moisture < 14%).",
                    "approximate_harvest_period": "125 to 140 days after sowing",
                    "harvesting_method": "Manual reaping using sickles or tractor-drawn combine harvester during bright sunny days.",
                    "handling_precautions": "Avoid harvesting during overcast or drizzly weather to prevent grain bleaching and sprouting.",
                    "storage_preparation": "Dry grains to 10-12% moisture; ensure storage bin (Kothi/metal silo) is fumigated and airtight."
                },
                "post_harvest": {
                    "cleaning_and_grading": "De-stoning, screening, and magnetic separation to remove impurities.",
                    "storage_method": "Metal silos or CAP (Cover and Plinth) storage with hermetic liners.",
                    "preservation_method": "Aluminum phosphide fumigation for weevil control under technical supervision.",
                    "processing_method": "Roller milling for Atta, Maida, Sooji/Rava, and Bran separation.",
                    "packaging_method": "Moisture-barrier multi-wall paper bags or food-grade LDPE liners.",
                    "food_uses": "Chapatis, breads, bakery cookies, pasta, noodles, porridge.",
                    "industrial_uses": "Bioethanol, industrial adhesives, bio-plastics from wheat starch.",
                    "by_products": "Wheat straw (Bhusa - premium cattle fodder), wheat germ oil."
                },
                "products": [
                    {
                        "product_name": "Whole Wheat Stone-Ground Atta",
                        "product_category": "Food",
                        "raw_material": "Cleaned whole grain wheat",
                        "processing_overview": "Slow chakki milling at low temperature to preserve bran fiber, germ vitamins, and natural aroma.",
                        "common_uses": "Traditional rotis, flatbreads, high-fiber baking.",
                        "storage_considerations": "Keep in airtight containers; best used within 90 days due to whole germ oils.",
                        "potential_value_addition": "Milling whole wheat into packaged branded atta doubles gross margins compared to bulk grain trading."
                    }
                ]
            },
            {
                "name": "Maize",
                "scientific_name": "Zea mays",
                "category": "Cereal",
                "description": "Known as the 'Queen of Cereals' due to its high genetic yield potential. Used extensively for poultry feed, animal fodder, corn starch, and human culinary uses.",
                "suitable_regions": "South India, Central India, North India, North-East",
                "soil_requirements": "Loamy, Sandy Loam, Alluvial, Red soil",
                "climate_requirements": "Warm climate; 21°C - 30°C; frost sensitive; moderate rainfall (500-800 mm)",
                "season": "Kharif, Rabi",
                "water_requirement": "Medium",
                "difficulty_level": "Beginner",
                "image_path": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
                "cultivation": {
                    "land_preparation": "Plough field deeply with mould board plough followed by 2 disk harrowings. Form ridges and furrows 60 cm apart.",
                    "seed_selection": "Plant high yielding hybrids (e.g. Pioneer 3396, DKC 9108). Treat seeds with Thiram + Carbendazim @ 2 g/kg.",
                    "sowing_method": "Dibble one seed per hill on side of ridge at 60x20 cm spacing, 3-4 cm depth.",
                    "irrigation": "Irrigate immediately after sowing, then at knee-high stage, tasseling, silking, and grain filling.",
                    "nutrient_management": "Apply 150 kg N, 60 kg P2O5, 60 kg K2O/ha. Split Nitrogen into 3 equal doses at planting, knee-high, and tasseling.",
                    "weed_management": "Pre-emergence spray of Atrazine 50 WP @ 1.0 kg a.i./ha within 2 days of sowing followed by one hand hoeing at 30 DAS.",
                    "growth_stages": "Emergence (4-6 d) -> Knee high (30-35 d) -> Tasseling (55-60 d) -> Silking (65-70 d) -> Dough (85-90 d) -> Maturity (100-115 d)",
                    "beginner_mistakes": "Waterlogging in early seedling stage; moisture stress during tasseling-silking period ruins kernel set."
                },
                "pests": [
                    {
                        "name": "Fall Armyworm (Spodoptera frugiperda)",
                        "type": "Pest",
                        "symptoms": "Ragged feeding holes on whorl leaves with copious amounts of sawdust-like frass.",
                        "conditions": "Warm and dry weather followed by intermittent showers; continuous monocropping.",
                        "prevention": "Intercrop with pulses (cowpea); install pheromone traps @ 5/acre for early alert.",
                        "management": "Whorl application of neem oil (5 ml/L) or Bacillus thuringiensis (Bt) @ 2 g/L; for severe infestation, Emamectin benzoate 5 SG @ 0.4 g/L.",
                        "source_reference": "ICAR-Indian Institute of Maize Research (IIMR)",
                        "last_reviewed_at": "2026-03-22"
                    }
                ],
                "harvest": {
                    "maturity_indicators": "Outer husk leaves dry and turn straw brown; black layer forms at the base of grain kernel.",
                    "approximate_harvest_period": "95 to 115 days after planting",
                    "harvesting_method": "De-husking cobs manually from standing stalks or mechanical corn combine.",
                    "handling_precautions": "Dry harvested cobs on clean threshing floor in sun to bring cob moisture under 15%.",
                    "storage_preparation": "Shell cobs using power corn sheller and dry shelled grain to 12% moisture."
                },
                "post_harvest": {
                    "cleaning_and_grading": "Air aspiration to eliminate husk residues, light kernels, and foreign matter.",
                    "storage_method": "Airtight metal drums or Purdue Improved Crop Storage (PICS) bags.",
                    "preservation_method": "Prevent Aspergillus flavus (aflatoxin) contamination by avoiding high-moisture storage.",
                    "processing_method": "Dry milling for cornmeal/grits; wet milling for starch and high-fructose corn syrup.",
                    "packaging_method": "Multi-layered woven polypropylene bags.",
                    "food_uses": "Corn flakes, roasted sweet corn, popcorn, corn flour tortillas.",
                    "industrial_uses": "Industrial corn starch, packaging bio-polymers, ethanol distillation.",
                    "by_products": "Maize stover (livestock forage), corn cob powder (adsorbent, animal bedding)."
                },
                "products": [
                    {
                        "product_name": "Corn Starch & Dextrin",
                        "product_category": "Industrial & Food",
                        "raw_material": "Dry shelled yellow maize grain",
                        "processing_overview": "Wet milling separation of endosperm starch from germ and gluten protein.",
                        "common_uses": "Thickening agent in confectionery, paper sizing, pharmaceutical pill binder.",
                        "storage_considerations": "Cool dry warehouse; keep protected from moisture absorption.",
                        "potential_value_addition": "Industrial starch commands 2.5x the market price of unprocessed feed corn."
                    }
                ]
            },
            {
                "name": "Tomato",
                "scientific_name": "Solanum lycopersicum",
                "category": "Vegetable",
                "description": "Tomato is one of the most widely cultivated commercial vegetables in India, providing steady cash flow to farmers. Rich in lycopene, vitamin C, and antioxidants.",
                "suitable_regions": "South India, Western India, Central India, Pan-India",
                "soil_requirements": "Loamy, Sandy Loam, Red soil, Black soil",
                "climate_requirements": "Mild, frost-free climate; optimal day temperature 21°C - 26°C; night temperature 15°C - 20°C",
                "season": "Rabi, Kharif, Year-round",
                "water_requirement": "Medium",
                "difficulty_level": "Intermediate",
                "image_path": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
                "cultivation": {
                    "land_preparation": "Plough to 25 cm depth, incorporate 25 tonnes/ha decomposed FYM. Prepare raised beds (1 m width) with drip lines and silver-black mulch.",
                    "seed_selection": "High-yielding determinate/indeterminate hybrids (e.g. US 440, Shivam, Abhinav) with ToLCV resistance.",
                    "sowing_method": "Raise seedlings in pro-trays using sterilized cocopeat. Transplant 25-day seedlings at 60x45 cm spacing.",
                    "irrigation": "Drip irrigation daily based on evapo-transpiration (2-4 liters/plant/day). Avoid wetting foliage.",
                    "nutrient_management": "Fertigation with 180:120:180 kg NPK/ha distributed across vegetative, flowering, and fruit-bearing cycles.",
                    "weed_management": "Silver-black polyethylene mulching suppresses 95% of weeds and conserves soil moisture.",
                    "growth_stages": "Nursery (1-25 d) -> Vegetative establishment (26-50 d) -> Flowering & Fruit Set (50-70 d) -> Fruit Development (70-90 d) -> Harvesting flushes (90-150 d)",
                    "beginner_mistakes": "Over-head sprinkler irrigation that spreads fungal blight spores; fluctuating watering causing blossom end rot."
                },
                "pests": [
                    {
                        "name": "Early Blight (Alternaria solani)",
                        "type": "Disease",
                        "symptoms": "Concentric rings ('target board' pattern) with chlorotic halos on older leaves moving upwards.",
                        "conditions": "High humidity alternating with warm sunny days; dense foliage touching soil.",
                        "prevention": "Prune lower leaves touching soil; stake indeterminate varieties; rotate with non-solanaceous crops.",
                        "management": "Spray Mancozeb 75 WP @ 2.5 g/L or Chlorothalonil 75 WP @ 2 g/L upon observing early spots.",
                        "source_reference": "ICAR-Indian Institute of Vegetable Research (IIVR)",
                        "last_reviewed_at": "2026-04-05"
                    },
                    {
                        "name": "Tomato Pinworm / Leafminer (Tuta absoluta)",
                        "type": "Pest",
                        "symptoms": "Blotch-like mines on leaves and pinhole exit holes around the fruit calyx with dark frass.",
                        "conditions": "Warm ambient temperature (>25°C), high density continuous solanaceous cultivation.",
                        "prevention": "Install delta pheromone traps; release egg parasitoid Trichogramma achaeae.",
                        "management": "Spray Chlorantraniliprole 18.5 SC @ 0.3 ml/L or Spinosad 45 SC @ 0.3 ml/L.",
                        "source_reference": "National Bureau of Agricultural Insect Resources (NBAIR)",
                        "last_reviewed_at": "2026-03-30"
                    }
                ],
                "harvest": {
                    "maturity_indicators": "Breaker stage (slight pink at blossom end) for distant transit; fully red ripe for immediate table use or processing.",
                    "approximate_harvest_period": "75 to 85 days after transplanting (multiple pickings every 4-5 days)",
                    "harvesting_method": "Hand pick with gentle twisting motion, retaining green calyx to prevent decay entry.",
                    "handling_precautions": "Harvest in early morning hours; avoid stacking plastic crates higher than 4 layers.",
                    "storage_preparation": "Pre-cool with forced air to 10-12°C to remove field heat and retard respiration."
                },
                "post_harvest": {
                    "cleaning_and_grading": "Wash in chlorinated water (50-100 ppm) to remove dirt; grade into Class A, B based on color and firmness.",
                    "storage_method": "Cold storage at 10-12°C with 90-95% relative humidity (storage life 2-3 weeks).",
                    "preservation_method": "Thermal processing for puree, vacuum concentration for tomato paste, hot-air dehydration for tomato powder.",
                    "processing_method": "Hot break extraction at 85-90°C to inactivate pectinase enzymes for thick puree viscosity.",
                    "packaging_method": "Sterile glass bottles, retort pouches, or aseptic bag-in-box cartons.",
                    "food_uses": "Fresh salads, tomato ketchup, pizza sauce, canned peeled tomatoes, pickles.",
                    "industrial_uses": "Extraction of natural lycopene carotenoid for nutraceutical supplements.",
                    "by_products": "Tomato pomace (seeds and skins) for animal feed and antioxidant oil extraction."
                },
                "products": [
                    {
                        "product_name": "Artisanal Tomato Puree & Ketchup",
                        "product_category": "Food",
                        "raw_material": "Fully ripe red processing tomatoes",
                        "processing_overview": "Washing, blanching, pulping through double-mesh pulper, seasoning with spices/vinegar, hot filling.",
                        "common_uses": "Culinary gravies, condiment sauce, institutional catering supply.",
                        "storage_considerations": "Hermetically sealed bottles have 12-month ambient shelf life.",
                        "potential_value_addition": "During peak glut when farmgate tomato falls to ₹5/kg, converting into puree adds 300%+ net value."
                    },
                    {
                        "product_name": "Sun-Dried Tomatoes in Olive/Canola Herb Infusion",
                        "product_category": "Food & Gourmet",
                        "raw_material": "Firm ripe plum/Roma tomatoes",
                        "processing_overview": "Halved, deseeded, treated with sodium metabisulfite or natural sea salt, dehydrated to 18% moisture, packed in oil.",
                        "common_uses": "Italian pastas, gourmet sandwiches, pizza toppings.",
                        "storage_considerations": "Glass jars; room temperature storage up to 1 year.",
                        "potential_value_addition": "High-margin export gourmet item selling at ₹600-900/kg retail."
                    }
                ]
            },
            {
                "name": "Cotton",
                "scientific_name": "Gossypium hirsutum",
                "category": "Cash Crop",
                "description": "Known as 'White Gold', cotton is India's principal commercial fibre crop, sustaining millions of rural textile livelihoods and ginning industries.",
                "suitable_regions": "Central India (Maharashtra, Gujarat, MP), South India (Telangana, AP, Karnataka)",
                "soil_requirements": "Black soil, Deep Alluvial, Clay Loam",
                "climate_requirements": "Warm climate; minimum 180-200 frost-free days; 21°C - 30°C; 500-750 mm rainfall",
                "season": "Kharif",
                "water_requirement": "Medium",
                "difficulty_level": "Intermediate",
                "image_path": "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&w=800&q=80",
                "cultivation": {
                    "land_preparation": "Deep summer ploughing followed by 2 harrowings. Incorporate 10 tonnes/ha FYM to enhance water holding capacity of black soils.",
                    "seed_selection": "Approved Bt Cotton hybrids (e.g. Bollgard II) suitable for the agro-climatic zone.",
                    "sowing_method": "Dibble on ridges or flat beds at 90x60 cm or 120x45 cm spacing, depending on vegetative architecture.",
                    "irrigation": "Irrigate at critical stages: squaring, flowering, and boll development. Avoid water excess during boll bursting.",
                    "nutrient_management": "Apply 120 kg N, 60 kg P2O5, 60 kg K2O/ha. Top dress nitrogen in 3 split doses coinciding with square formation and boll filling.",
                    "weed_management": "Apply Pendimethalin @ 1.0 kg a.i./ha as pre-emergence followed by inter-cultivation with blade harrows at 30 and 60 DAS.",
                    "growth_stages": "Germination (5-8 d) -> Squaring (35-45 d) -> Flowering (60-70 d) -> Boll setting (75-100 d) -> Boll bursting & picking (120-160 d)",
                    "beginner_mistakes": "Over-fertilization with nitrogen causing excessive vegetative growth and delayed maturity; waterlogging in heavy black soils."
                },
                "pests": [
                    {
                        "name": "Pink Bollworm (Pectinophora gossypiella)",
                        "type": "Pest",
                        "symptoms": "Rosetted flowers that fail to open properly; damaged seeds and stained lint inside bolls.",
                        "conditions": "Extended cropping season, presence of ratoon cotton crops, and non-destruction of crop residues.",
                        "prevention": "Enforce 150-160 day crop duration; install light and gossyplure pheromone traps; destroy stalks after final picking.",
                        "management": "Release Trichogrammatoidea bactrae parasitoid; apply Profenofos 50 EC @ 2 ml/L or Thiodicarb 75 WP @ 2 g/L.",
                        "source_reference": "ICAR-Central Institute for Cotton Research (CICR) Advisory",
                        "last_reviewed_at": "2026-04-12"
                    }
                ],
                "harvest": {
                    "maturity_indicators": "Bolls burst cleanly exposing clean white fluffy lint with seed moisture around 10-12%.",
                    "approximate_harvest_period": "140 to 175 days after sowing (3 to 4 sequential pickings)",
                    "harvesting_method": "Manual hand-picking in dry sunny weather after morning dew has evaporated completely.",
                    "handling_precautions": "Keep picked seed cotton free of bracts, leaves, and synthetic polypropylene twine contaminants.",
                    "storage_preparation": "Heap picked cotton in covered, well-ventilated sheds with moisture below 8-9% to prevent discolouration."
                },
                "post_harvest": {
                    "cleaning_and_grading": "Pre-ginning seed cotton cleaning with cylinder cleaners to remove leaf trash and dirt.",
                    "storage_method": "Store in clean godowns on tarpaulin sheets; avoid moisture condensation.",
                    "preservation_method": "Protect bales from fire hazards and water seepage in accredited warehousing.",
                    "processing_method": "Saw ginning or double roller ginning to separate lint fibre from cotton seed, followed by hydraulic bale pressing.",
                    "packaging_method": "170 kg standard bales covered in 100% cotton cloth and tied with galvanized wire straps.",
                    "food_uses": "Refined cottonseed oil used in blended edible oils and vanaspati ghee.",
                    "industrial_uses": "Textile spinning, surgical cotton absorbent, currency grade paper pulp.",
                    "by_products": "Cottonseed cake (high protein cattle feed), cotton stalks for particle board manufacturing."
                },
                "products": [
                    {
                        "product_name": "Refined Cottonseed Cooking Oil",
                        "product_category": "Food",
                        "raw_material": "Crushed cotton seeds separated during ginning",
                        "processing_overview": "Delinting, dehulling, solvent extraction, neutralisation of gossypol pigment, deodorisation.",
                        "common_uses": "Commercial frying oil, bakery shortening, domestic cooking.",
                        "storage_considerations": "Store in sealed food-grade containers away from direct heat.",
                        "potential_value_addition": "Ginning mills that install oil extraction units capture additional 35% margin on seed residue."
                    }
                ]
            },
            {
                "name": "Banana",
                "scientific_name": "Musa acuminata",
                "category": "Fruit",
                "description": "Banana is the world's most popular commercial fruit and a key perennial fruit crop in India, yielding year-round food security and exceptional biomass.",
                "suitable_regions": "South India (Tamil Nadu, Kerala, Karnataka), West India (Maharashtra, Gujarat), Andhra Pradesh",
                "soil_requirements": "Loamy, Alluvial, Clay Loam",
                "climate_requirements": "Tropical humid climate; 20°C - 35°C; sensitive to frost and high winds; annual rainfall 1200-1500 mm",
                "season": "Year-round",
                "water_requirement": "High",
                "difficulty_level": "Intermediate",
                "image_path": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
                "cultivation": {
                    "land_preparation": "Dig pits of 60x60x60 cm. Fill with topsoil, 10 kg FYM, 250 g neem cake, and 20 g Carbofuran/Trichoderma.",
                    "seed_selection": "Disease-free sword suckers (weight 1.5-2.0 kg) or certified virus-free tissue culture plantlets of Grand Naine (G9) or Robusta.",
                    "sowing_method": "Plant tissue culture plantlets at 1.8x1.8 m or 1.5x1.5 m spacing. Provide light irrigation immediately.",
                    "irrigation": "Drip irrigation supplying 15-20 liters/plant/day during vegetative growth, stepping up to 25 L during bunch emergence.",
                    "nutrient_management": "Apply 200 g N, 60 g P2O5, 300 g K2O per plant per crop cycle in monthly splits via fertigation.",
                    "weed_management": "Regular shallow intercultural operations or growing leguminous cover crops (cowpea) in young plantation.",
                    "growth_stages": "Establishment (0-3 mo) -> Rapid Vegetative (4-7 mo) -> Bunch Shooting (8-9 mo) -> Bunch Development (10-11 mo) -> Harvest (11-13 mo)",
                    "beginner_mistakes": "Neglecting wind propping with bamboo poles during bunch filling leads to plant toppling; ignoring sucker desuckering."
                },
                "pests": [
                    {
                        "name": "Panama Wilt (Fusarium oxysporum f. sp. cubense)",
                        "type": "Disease",
                        "symptoms": "Yellowing of lower leaf margins, longitudinal splitting of pseudostem base, and vascular discoloration.",
                        "conditions": "Acidic soils, continuous cultivation of susceptible cultivars, and waterlogged conditions.",
                        "prevention": "Use tissue culture plantlets of resistant Cavendish varieties (Grand Naine); dip suckers in Carbendazim (0.2%).",
                        "management": "Drench basin with Carbendazim 0.1% or bio-control Pseudomonas fluorescens @ 20 g/plant.",
                        "source_reference": "ICAR-National Research Centre for Banana (NRCB), Tiruchirappalli",
                        "last_reviewed_at": "2026-03-12"
                    }
                ],
                "harvest": {
                    "maturity_indicators": "Fingers become rounded (disappearance of angular ridges); floral remnants drop easily; fruit color turns light green.",
                    "approximate_harvest_period": "11 to 13 months after planting",
                    "harvesting_method": "Cut the pseudostem half-way, lower bunch gently onto a padded shoulder cushion, and sever 30 cm above top hand.",
                    "handling_precautions": "Never drop bunches on bare soil; cushion with foam pads during field transport.",
                    "storage_preparation": "De-hand bunches into export crates, wash in water tank with alum to wash away latex bleeding."
                },
                "post_harvest": {
                    "cleaning_and_grading": "Latex removal in wash tanks, fungicide dip (alum + thiabendazole), grading by finger caliber and length.",
                    "storage_method": "Cold storage at 13-14°C with 90-95% RH (preserves green life for 3-4 weeks).",
                    "preservation_method": "Controlled atmosphere (3% O2, 5% CO2) or modified atmosphere packaging (MAP) bags.",
                    "processing_method": "Controlled ethylene gas ripening (100 ppm at 16-18°C for 24-48 hours) in forced-draft ripening chambers.",
                    "packaging_method": "13 kg corrugated fiberboard telescopic export cartons with polyethylene liners.",
                    "food_uses": "Fresh dessert fruit, banana chips, green banana flour, puree for baby food.",
                    "industrial_uses": "Pseudostem fibre for handicraft textiles and high-grade currency paper pulp.",
                    "by_products": "Pseudostem central core (cooked as vegetable), banana sap for natural mordant/dye."
                },
                "products": [
                    {
                        "product_name": "Crispy Vacuum-Fried Banana Chips",
                        "product_category": "Food & Snacks",
                        "raw_material": "Mature green Nendran bananas",
                        "processing_overview": "Slicing, soaking in turmeric brine, low-temperature vacuum frying to preserve golden color and reduce oil absorption.",
                        "common_uses": "Gourmet packaged snack, export savory item.",
                        "storage_considerations": "Nitrogen-flushed metallized pouches have 6-month shelf life without rancidity.",
                        "potential_value_addition": "Raw Nendran sells at ₹35/kg; vacuum fried chips sell at ₹350-450/kg."
                    },
                    {
                        "product_name": "Gluten-Free Resistant Starch Banana Flour",
                        "product_category": "Health & Nutrition",
                        "raw_material": "Unripe green cull bananas",
                        "processing_overview": "Washing, peeling, antioxidant citric acid dip, solar/cabinet drying at 55°C, and micro-pulverizing.",
                        "common_uses": "Prebiotic dietary fiber supplement, gluten-free baking flour for gut health.",
                        "storage_considerations": "Airtight moisture-barrier canisters in dry pantry.",
                        "potential_value_addition": "Converts unsaleable small or blemished green bananas into high-value functional superfood."
                    }
                ]
            },
            {
                "name": "Sugarcane",
                "scientific_name": "Saccharum officinarum",
                "category": "Cash Crop",
                "description": "Sugarcane is a massive perennial tropical grass and the backbone of India's sweetener, ethanol biofuel, and rural cogeneration energy sectors.",
                "suitable_regions": "North India (UP, Bihar, Punjab), South India (Maharashtra, Tamil Nadu, Karnataka)",
                "soil_requirements": "Deep Loamy, Alluvial, Black soil",
                "climate_requirements": "Tropical to sub-tropical; warm sunny days (25°C - 35°C); requires high sunlight duration and 1000-1500 mm water",
                "season": "Year-round",
                "water_requirement": "High",
                "difficulty_level": "Intermediate",
                "image_path": "https://images.unsplash.com/photo-1596706979685-64bc95f51276?auto=format&fit=crop&w=800&q=80",
                "cultivation": {
                    "land_preparation": "Deep ploughing up to 40 cm with disc/chisel plough followed by cross-harrowing. Make furrows 120-150 cm apart.",
                    "seed_selection": "Use 8-10 month old healthy nursery seed canes with active buds (varieties Co 0238, Co 86032).",
                    "sowing_method": "Plant two-budded setts end-to-end in furrows or single bud settlings raised in nurseries (SSI method).",
                    "irrigation": "Furrow irrigation every 7-10 days in summer and 15-20 days in winter. Drip fertigation saves 40% water.",
                    "nutrient_management": "Apply 250-300 kg N, 100 kg P2O5, 120 kg K2O/ha. Split Nitrogen into 3 doses with final application at 90-100 days earthing-up.",
                    "weed_management": "Pre-emergence Atrazine @ 2.0 kg a.i./ha followed by earthing up and trash mulching in alternate rows.",
                    "growth_stages": "Germination (1-35 d) -> Tillering (36-100 d) -> Grand Growth/Elongation (101-270 d) -> Ripening & Sugar Accumulation (271-360 d)",
                    "beginner_mistakes": "Applying late nitrogen fertilizers after 120 days delays sugar accumulation and increases vegetative juice impurities."
                },
                "pests": [
                    {
                        "name": "Red Rot (Colletotrichum falcatum)",
                        "type": "Disease",
                        "symptoms": "Third or fourth leaf from top turns yellow and dries. Splitting the cane reveals red discoloration with crosswise white patches and alcoholic odor.",
                        "conditions": "Waterlogging, infected planting setts, continuous monocropping of susceptible varieties.",
                        "prevention": "Plant certified disease-free setts; heat therapy (moist hot air treatment at 54°C for 2.5 hrs); avoid ratooning infected fields.",
                        "management": "Uproot and burn infected clumps. Drench soil with Carbendazim 0.1% or bioagent Trichoderma harzianum.",
                        "source_reference": "ICAR-Sugarcane Breeding Institute (SBI), Coimbatore",
                        "last_reviewed_at": "2026-03-25"
                    }
                ],
                "harvest": {
                    "maturity_indicators": "Leaves dry up from bottom; metallic ringing sound when cane is tapped with fingernail; refractometer Brix reaches 18-20%.",
                    "approximate_harvest_period": "10 to 12 months after planting",
                    "harvesting_method": "Cut canes flush with ground level using sharp cutting knives (maximum sugar resides in bottom internodes).",
                    "handling_precautions": "Transport cut cane to sugar mill or jaggery crushers within 24-48 hours to avoid post-harvest inversion loss.",
                    "storage_preparation": "Cannot be stored long-term; process immediately upon cutting."
                },
                "post_harvest": {
                    "cleaning_and_grading": "De-trashing to eliminate green tops and dry foliage.",
                    "storage_method": "Direct milling; cane held in shade with water sprinkling if transport is delayed.",
                    "preservation_method": "Juice pasteurisation and clarification using vegetal clarificants (Bhindi mucilage / lime).",
                    "processing_method": "Three-roller crushing, juice evaporation in open boiling pans, strike pan crystallization.",
                    "packaging_method": "Jaggery blocks in moisture-proof polypropylene pouches or eco-friendly palm leaf cartons.",
                    "food_uses": "Refined sugar, artisanal jaggery (Gur), fresh sugarcane juice.",
                    "industrial_uses": "Bio-ethanol blending with petrol (E20 mandate), molasses for alcohol and spirits.",
                    "by_products": "Bagasse (co-generation thermal power, paper manufacturing), Pressmud (organic bio-compost)."
                },
                "products": [
                    {
                        "product_name": "Organic Chemical-Free Jaggery Blocks & Granules",
                        "product_category": "Food & Sweetener",
                        "raw_material": "Freshly extracted sugarcane juice",
                        "processing_overview": "Traditional pan boiling clarified with wild okra extract without chemical hydrosulfites, molded into blocks or granulated.",
                        "common_uses": "Nutritious traditional sweetener, iron-rich health substitute for refined white sugar.",
                        "storage_considerations": "Store in sealed dry packaging; sensitive to monsoon atmospheric moisture.",
                        "potential_value_addition": "Chemical-free jaggery powder sells at ₹80-120/kg compared to raw cane value of ₹3.50/kg."
                    }
                ]
            },
            {
                "name": "Groundnut",
                "scientific_name": "Arachis hypogaea",
                "category": "Pulse & Oilseed",
                "description": "Also called peanut, groundnut is a high-value legume crop that fixes atmospheric nitrogen while producing nutrient-dense edible oil, protein, and cattle feed.",
                "suitable_regions": "South India (Gujarat, Andhra Pradesh, Tamil Nadu, Karnataka, Rajasthan)",
                "soil_requirements": "Sandy, Sandy Loam, Red soil, Loamy",
                "climate_requirements": "Warm climate; optimal 25°C - 30°C; requires 500-700 mm well-distributed rainfall",
                "season": "Kharif, Rabi",
                "water_requirement": "Low",
                "difficulty_level": "Beginner",
                "image_path": "https://images.unsplash.com/photo-1567892787550-93a9d9c22e4c?auto=format&fit=crop&w=800&q=80",
                "cultivation": {
                    "land_preparation": "Plough 2-3 times to create a friable, well-aerated seedbed to facilitate easy penetration of geotropic pegs.",
                    "seed_selection": "Bold, healthy seeds (varieties Kadiri 6, TMV 7, TAG 24). Inoculate seeds with Rhizobium culture + Trichoderma.",
                    "sowing_method": "Line sowing at 30x10 cm spacing at 4-5 cm depth using seed drill or country plough.",
                    "irrigation": "Sensitive stages: Flowering, Pegging (35-45 DAS), and Pod development. Avoid water deficit during pegging.",
                    "nutrient_management": "Apply 20 kg N, 40 kg P2O5, 40 kg K2O/ha. Crucial: Apply Gypsum @ 400 kg/ha at pegging (40-45 DAS) for calcium pod filling.",
                    "weed_management": "Hand weeding at 20 and 40 DAS. Never disturb soil after 45 days as it breaks developing underground pegs.",
                    "growth_stages": "Emergence (5-7 d) -> Flowering (25-30 d) -> Pegging (35-45 d) -> Pod development (50-80 d) -> Pod maturity (95-115 d)",
                    "beginner_mistakes": "Intercultivating or hoeing after peg formation, which cuts off entering pegs; skipping gypsum causing empty 'pops'."
                },
                "pests": [
                    {
                        "name": "Tikka Leaf Spot (Cercospora arachidicola)",
                        "type": "Disease",
                        "symptoms": "Dark brown circular spots on leaf surface surrounded by distinct yellow rings causing premature defoliation.",
                        "conditions": "Warm, humid weather with prolonged cloudy days and rain showers.",
                        "prevention": "Seed treatment with Thiram + Carbendazim; field sanitation and crop rotation.",
                        "management": "Spray Mancozeb @ 2.5 g/L or Chlorothalonil @ 2 g/L at first appearance of spots.",
                        "source_reference": "ICAR-Directorate of Groundnut Research (DGR), Junagadh",
                        "last_reviewed_at": "2026-03-10"
                    }
                ],
                "harvest": {
                    "maturity_indicators": "Leaves turn yellow and shed; inside of the pod shell develops a dark brown/blackish net lining.",
                    "approximate_harvest_period": "100 to 120 days after sowing",
                    "harvesting_method": "Pull out plants manually or with tractor-drawn digger in moderately moist soil to prevent pods detaching in ground.",
                    "handling_precautions": "Shake off clinging soil; strip pods from haulms immediately.",
                    "storage_preparation": "Sun-dry pods for 5-7 days until pods rattle and moisture drops below 8-9% to prevent aflatoxin."
                },
                "post_harvest": {
                    "cleaning_and_grading": "De-stoning, aspiration of soil clods, and grading pods into bold, medium, and small.",
                    "storage_method": "Store unshelled pods in gunny bags in cool, dry, well-ventilated rodent-proof storage.",
                    "preservation_method": "Do not shell pods until ready for milling to avoid insect damage and oil oxidation.",
                    "processing_method": "Decortication (shelling), followed by cold mechanical expeller pressing for virgin oil.",
                    "packaging_method": "Tin containers or dark amber glass bottles for oil; vacuum bags for roasted kernels.",
                    "food_uses": "Cooking oil, peanut butter, roasted salted nuts, groundnut chikki/brittle.",
                    "industrial_uses": "Biolubricants, cosmetic skincare formulations.",
                    "by_products": "Groundnut cake (high-protein 45-50% dairy cattle concentrate), shells (fuel briquettes)."
                },
                "products": [
                    {
                        "product_name": "Cold-Pressed Virgin Groundnut Oil (Mara Chekku)",
                        "product_category": "Food & Health",
                        "raw_material": "Premium handpicked groundnut kernels",
                        "processing_overview": "Traditional slow wooden expeller (Ghani) crushing without chemical solvents or heat treatment.",
                        "common_uses": "Aromatic healthy culinary oil with high monounsaturated fats.",
                        "storage_considerations": "Keep in cool dark place away from direct sunlight; 12-month shelf life.",
                        "potential_value_addition": "Cold pressed oil fetches ₹280-350/L compared to regular refined oil at ₹160/L."
                    },
                    {
                        "product_name": "High-Protein Peanut Butter",
                        "product_category": "Food & Fitness",
                        "raw_material": "Dry roasted blanched groundnut kernels",
                        "processing_overview": "Roasting kernels to 160°C, skin removal, stone grinding into a creamy or crunchy butter with a touch of sea salt.",
                        "common_uses": "Fitness dietary spread, high-protein snack, baking ingredient.",
                        "storage_considerations": "Glass jars; room temperature storage for 9 months.",
                        "potential_value_addition": "Retail value increases 4x relative to raw groundnut kernel pricing."
                    }
                ]
            },
            {
                "name": "Finger Millet (Ragi)",
                "scientific_name": "Eleusine coracana",
                "category": "Millet",
                "description": "Ragi is a super nutri-cereal resilient to severe drought and climate change. Exceptionally rich in calcium (344 mg/100g), dietary fiber, and essential amino acids.",
                "suitable_regions": "South India (Karnataka, Tamil Nadu, Andhra Pradesh), Odisha, Uttarakhand, Maharashtra",
                "soil_requirements": "Red soil, Loamy, Sandy Loam, Clay Loam",
                "climate_requirements": "Semi-arid to tropical; 20°C - 32°C; highly drought tolerant; thrives on 500-750 mm rainfall",
                "season": "Kharif, Rabi",
                "water_requirement": "Low",
                "difficulty_level": "Beginner",
                "image_path": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
                "cultivation": {
                    "land_preparation": "Plough twice and harrow to obtain a firm, pulverized seed bed free from large clods.",
                    "seed_selection": "High yielding varieties (e.g. GPU 28, ML 365, CO 14). Treat seeds with Azospirillum (600 g/ha).",
                    "sowing_method": "Transplanting 20-day old seedlings at 25x10 cm spacing or direct line sowing with seed drill.",
                    "irrigation": "Primarily rainfed. If irrigated, provide 4-5 irrigations: tillering, flowering, and grain filling stages.",
                    "nutrient_management": "Apply 60 kg N, 30 kg P2O5, 30 kg K2O/ha. Combine with 5 tonnes/ha FYM.",
                    "weed_management": "Two hand weedings at 15-20 and 35-40 days after sowing or cono-weeding in line planted plots.",
                    "growth_stages": "Germination (3-5 d) -> Tillering (20-35 d) -> Flag leaf (50-60 d) -> Flowering (65-75 d) -> Dough (85-95 d) -> Maturity (100-115 d)",
                    "beginner_mistakes": "Sowing seeds too deep (exceeding 2 cm) drastically curtails seedling emergence due to tiny seed size."
                },
                "pests": [
                    {
                        "name": "Ragi Blast (Pyricularia grisea)",
                        "type": "Disease",
                        "symptoms": "Spindle lesions with grey centers on leaves; neck blast causes drooping and chaffy fingers.",
                        "conditions": "Cool cloudy weather, intermittent drizzles, and high atmospheric humidity during flowering.",
                        "prevention": "Seed treatment with Pseudomonas fluorescens (10 g/kg); plant blast-resistant cultivars (GPU 28).",
                        "management": "Spray Mancozeb @ 2 g/L or Tricyclazole 75 WP @ 0.6 g/L at early heading stage.",
                        "source_reference": "ICAR-Indian Institute of Millets Research (IIMR), Hyderabad",
                        "last_reviewed_at": "2026-03-18"
                    }
                ],
                "harvest": {
                    "maturity_indicators": "Ear heads turn golden brown and seeds become hard and dark brown.",
                    "approximate_harvest_period": "100 to 115 days after sowing",
                    "harvesting_method": "Cut ear heads with sickles; leave straw to be harvested separately for nutritious livestock fodder.",
                    "handling_precautions": "Heap cut ear heads for 2-3 days in shade for sweating, which makes threshing easier.",
                    "storage_preparation": "Thresh, winnow, and dry grains in sun until moisture is below 11-12%."
                },
                "post_harvest": {
                    "cleaning_and_grading": "De-stoning and fine mesh sieving to remove micro-sand particles.",
                    "storage_method": "Traditional earthen bins (Koppara) or metal silos. Ragi grains naturally resist storage insect pests for years.",
                    "preservation_method": "Simple solar drying; virtually immune to storage weevils under dry conditions.",
                    "processing_method": "Malting (sprouting, drying, roasting, pulverizing) to enhance bioavailability of calcium and iron.",
                    "packaging_method": "Multi-layer pouches or food-grade standup pouches.",
                    "food_uses": "Ragi mudde (dumpling), ragi porridge, dosas, malt drink, diabetic bakery cookies.",
                    "industrial_uses": "Extruded infant health foods, brewing adjuncts.",
                    "by_products": "Ragi straw (exceptionally palatable cattle forage that improves dairy milk yield)."
                },
                "products": [
                    {
                        "product_name": "Sprouted Ragi Malt Health Mix",
                        "product_category": "Health & Nutrition",
                        "raw_material": "Cleaned whole finger millet grains",
                        "processing_overview": "Soaking grains for 12 hours, germinating for 48 hours to activate enzymes, sun drying, gentle roasting, and fine milling.",
                        "common_uses": "Nutritious infant weaning food, natural calcium health drink for all age groups.",
                        "storage_considerations": "Keep in airtight containers away from humidity; 9-month shelf life.",
                        "potential_value_addition": "Raw ragi sells at ₹35/kg; sprouted malt sells at ₹220-300/kg."
                    }
                ]
            },
            {
                "name": "Chickpea (Bengal Gram)",
                "scientific_name": "Cicer arietinum",
                "category": "Pulse",
                "description": "Chickpea is the premier pulse crop of India, delivering critical plant protein to the vegetarian diet and restoring soil health by fixing atmospheric nitrogen.",
                "suitable_regions": "Central India (MP, Maharashtra), North India (Rajasthan, UP), South India (Karnataka, AP)",
                "soil_requirements": "Loamy, Clay, Alluvial, Black soil",
                "climate_requirements": "Cool, dry Rabi season; optimal 20°C - 25°C; sensitive to frost and waterlogging; 400-600 mm rainfall",
                "season": "Rabi",
                "water_requirement": "Low",
                "difficulty_level": "Beginner",
                "image_path": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80",
                "cultivation": {
                    "land_preparation": "Plough to medium depth followed by 1-2 harrowings to create a rough cloddy seedbed (prevents soil crusting).",
                    "seed_selection": "Desi varieties (JG 11, JAKI 9218) or Kabuli varieties (KAK 2, MNK 1). Treat seeds with Rhizobium + PSB.",
                    "sowing_method": "Drill seeds behind plough at 30x10 cm spacing at 8-10 cm depth to reach residual soil moisture.",
                    "irrigation": "Largely grown on residual moisture. If water is available, 1-2 protective irrigations at pre-flowering and pod filling.",
                    "nutrient_management": "Apply 20 kg N, 50 kg P2O5, 20 kg K2O/ha. Pulses require minimal nitrogen as root nodules fix atmospheric N.",
                    "weed_management": "Pre-emergence Pendimethalin @ 1.0 kg a.i./ha followed by one hand weeding at 30 DAS before canopy closure.",
                    "growth_stages": "Emergence (5-8 d) -> Vegetative branching (25-40 d) -> Flowering (45-65 d) -> Pod development (65-85 d) -> Maturity (95-115 d)",
                    "beginner_mistakes": "Excessive irrigation during vegetative stage causes lush leafy growth and flower dropping; heavy rain during flowering ruins pod set."
                },
                "pests": [
                    {
                        "name": "Gram Pod Borer (Helicoverpa armigera)",
                        "type": "Pest",
                        "symptoms": "Defoliation of tender leaves in early stage; circular boreholes in developing pods with larvae feeding inside.",
                        "conditions": "Warm days followed by cool nights; cloudy overcast periods during flowering and pod development.",
                        "prevention": "Intercrop with mustard/coriander (attracts beneficial parasitoids); install 'T' shaped bird perches @ 20/acre.",
                        "management": "Spray NPV (Nuclear Polyhedrosis Virus) @ 250 LE/ha or Chlorantraniliprole 18.5 SC @ 0.3 ml/L at early instar stage.",
                        "source_reference": "ICAR-Indian Institute of Pulses Research (IIPR), Kanpur",
                        "last_reviewed_at": "2026-03-28"
                    }
                ],
                "harvest": {
                    "maturity_indicators": "Leaves turn yellowish-brown and shed; pods turn light straw color and rattle when shaken.",
                    "approximate_harvest_period": "100 to 120 days after sowing",
                    "harvesting_method": "Cut plants with sickles close to the ground; heap on clean threshing floor.",
                    "handling_precautions": "Thresh with tractor or pulse thresher when plants are thoroughly dried.",
                    "storage_preparation": "Clean grains and sun dry to reduce moisture to 9-10% to prevent pulse beetle damage."
                },
                "post_harvest": {
                    "cleaning_and_grading": "Sieving and gravity separators to eliminate broken grains and chaff.",
                    "storage_method": "Hermetic PICS bags or metal bins layered with dry neem leaves.",
                    "preservation_method": "Pulse beetle (Callosobruchus chinensis) control using inert edible oil smearing (5 ml/kg grain).",
                    "processing_method": "Milling to produce Chana Dal (split chickpea) and fine Besan (chickpea gram flour).",
                    "packaging_method": "Moisture-proof poly bags.",
                    "food_uses": "Chana dal, besan pakoras, hummus, roasted snacks (Chana jor garam).",
                    "industrial_uses": "Gluten-free protein flour formulations for modern food alternatives.",
                    "by_products": "Chickpea husk and broken splits (Chuni - high-protein dairy animal feed)."
                },
                "products": [
                    {
                        "product_name": "Stone-Milled Pure Besan (Gram Flour)",
                        "product_category": "Food",
                        "raw_material": "Premium dehulled Chana Dal",
                        "processing_overview": "Slow cool milling of split Bengal gram to retain rich golden hue and high natural protein aroma.",
                        "common_uses": "Traditional sweets (laddoo, mysore pak), savory batters, extruded namkeens.",
                        "storage_considerations": "Airtight containers away from humidity; 6-month shelf life.",
                        "potential_value_addition": "Milling whole chickpea into packaged branded besan boosts gross returns by 55%."
                    },
                    {
                        "product_name": "Crispy Spiced Roasted Chana",
                        "product_category": "Food & Snacks",
                        "raw_material": "Whole Desi chickpeas",
                        "processing_overview": "Traditional sand-roasting at 220°C for instant puffing, dehusking, and seasoning with rock salt and herbs.",
                        "common_uses": "Low-fat, high-fiber, diabetes-friendly healthy daily snack.",
                        "storage_considerations": "Moisture-proof pouches.",
                        "potential_value_addition": "Roasting adds 120% margin over wholesale commodity chickpea prices."
                    }
                ]
            }
        ]

        print(f"[INFO] Seeding {len(crops_data)} Agricultural Crops & Comprehensive Guides...")
        for cdata in crops_data:
            existing = db.query(Crop).filter(Crop.name == cdata["name"]).first()
            if not existing:
                crop = Crop(
                    name=cdata["name"],
                    scientific_name=cdata["scientific_name"],
                    category=cdata["category"],
                    description=cdata["description"],
                    suitable_regions=cdata["suitable_regions"],
                    soil_requirements=cdata["soil_requirements"],
                    climate_requirements=cdata["climate_requirements"],
                    season=cdata["season"],
                    water_requirement=cdata["water_requirement"],
                    difficulty_level=cdata.get("difficulty_level", "Beginner"),
                    image_path=cdata["image_path"],
                    is_published=True,
                )
                db.add(crop)
                db.commit()
                db.refresh(crop)
                crop_id = crop.id
                print(f"  [+] Added Crop: {crop.name} (ID: {crop_id})")
            else:
                crop_id = existing.id

            # Cultivation Guide
            cg_data = cdata.get("cultivation")
            if cg_data:
                cg = db.query(CultivationGuide).filter(CultivationGuide.crop_id == crop_id).first()
                if not cg:
                    cg = CultivationGuide(
                        crop_id=crop_id,
                        land_preparation=cg_data["land_preparation"],
                        seed_selection=cg_data["seed_selection"],
                        sowing_method=cg_data["sowing_method"],
                        irrigation=cg_data["irrigation"],
                        nutrient_management=cg_data["nutrient_management"],
                        weed_management=cg_data["weed_management"],
                        growth_stages=cg_data["growth_stages"],
                        beginner_mistakes=cg_data.get("beginner_mistakes"),
                    )
                    db.add(cg)

            # Pests & Diseases
            for pdata in cdata.get("pests", []):
                p = db.query(PestDisease).filter(
                    PestDisease.crop_id == crop_id,
                    PestDisease.name == pdata["name"]
                ).first()
                if not p:
                    p = PestDisease(
                        crop_id=crop_id,
                        name=pdata["name"],
                        type=pdata["type"],
                        symptoms=pdata["symptoms"],
                        conditions=pdata["conditions"],
                        prevention=pdata["prevention"],
                        management=pdata["management"],
                        source_reference=pdata.get("source_reference"),
                        last_reviewed_at=pdata.get("last_reviewed_at"),
                    )
                    db.add(p)

            # Harvest Guide
            hg_data = cdata.get("harvest")
            if hg_data:
                hg = db.query(HarvestGuide).filter(HarvestGuide.crop_id == crop_id).first()
                if not hg:
                    hg = HarvestGuide(
                        crop_id=crop_id,
                        maturity_indicators=hg_data["maturity_indicators"],
                        approximate_harvest_period=hg_data["approximate_harvest_period"],
                        harvesting_method=hg_data["harvesting_method"],
                        handling_precautions=hg_data["handling_precautions"],
                        storage_preparation=hg_data["storage_preparation"],
                    )
                    db.add(hg)

            # Post Harvest Guide
            ph_data = cdata.get("post_harvest")
            if ph_data:
                ph = db.query(PostHarvestGuide).filter(PostHarvestGuide.crop_id == crop_id).first()
                if not ph:
                    ph = PostHarvestGuide(
                        crop_id=crop_id,
                        cleaning_and_grading=ph_data["cleaning_and_grading"],
                        storage_method=ph_data["storage_method"],
                        preservation_method=ph_data["preservation_method"],
                        processing_method=ph_data["processing_method"],
                        packaging_method=ph_data["packaging_method"],
                        food_uses=ph_data["food_uses"],
                        industrial_uses=ph_data["industrial_uses"],
                        by_products=ph_data["by_products"],
                    )
                    db.add(ph)

            # Value Added Products
            for pr_data in cdata.get("products", []):
                pr = db.query(CropProduct).filter(
                    CropProduct.crop_id == crop_id,
                    CropProduct.product_name == pr_data["product_name"]
                ).first()
                if not pr:
                    pr = CropProduct(
                        crop_id=crop_id,
                        product_name=pr_data["product_name"],
                        product_category=pr_data["product_category"],
                        raw_material=pr_data["raw_material"],
                        processing_overview=pr_data["processing_overview"],
                        common_uses=pr_data["common_uses"],
                        storage_considerations=pr_data["storage_considerations"],
                        potential_value_addition=pr_data["potential_value_addition"],
                    )
                    db.add(pr)

            db.commit()

        print("[SUCCESS] Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error during seeding: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
