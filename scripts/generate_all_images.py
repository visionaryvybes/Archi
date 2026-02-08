#!/usr/bin/env python3
"""
Generate all landing page and studio images using Nano Banana Pro (Gemini API).
Uses detailed prompts from STYLE_PROMPTS library for accurate, high-quality 4K images.
Runs concurrent requests for speed.
"""

import os
import sys
import json
import base64
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not API_KEY:
    print("ERROR: Set GEMINI_API_KEY environment variable")
    sys.exit(1)
MODEL = "gemini-2.0-flash-exp-image-generation"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "images", "landing")

# Base quality instructions for ALL prompts
QUALITY_PREFIX = "Generate a photorealistic, ultra high resolution 4K image. Professional architectural photography with perfect composition, natural lighting, and stunning detail. Magazine-worthy quality for Architectural Digest."

# ============================================================
# STYLE PROMPTS (from lib/gemini.ts)
# ============================================================

STYLE_PROMPTS = {
    'modern': 'sleek contemporary design with clean lines, minimalist furniture, neutral palette with strategic accent colors, floor-to-ceiling windows, polished concrete or hardwood floors, hidden storage, seamless surfaces',
    'scandinavian': 'light wood tones (birch, ash, pine), white or light gray walls, cozy textiles (chunky knit throws, sheepskin), hygge atmosphere, functional minimalist design, natural materials, subtle pastel accents, candles, abundant natural light',
    'japandi': 'Japanese-Scandinavian fusion, wabi-sabi elements, natural materials, muted earth tones, low furniture, zen garden influences, paper screens, bonsai, clean lines with organic touches',
    'mediterranean': 'warm terracotta tiles, whitewashed walls, arched doorways and windows, wrought iron details, olive and sage green tones, terra cotta pottery, exposed wooden beams, courtyard views, bougainvillea',
    'tropical': 'lush indoor plants (monstera, palms, bird of paradise), rattan and bamboo furniture, natural ventilation, ceiling fans, open-plan living, bright whites with tropical greens, resort-like atmosphere',
    'french-country': 'rustic elegance, soft florals, weathered wood, stone floors, copper cookware, lavender accents, toile de Jouy fabric, distressed furniture, provincial charm, exposed beams',
    'art-deco': '1920s glamour, geometric patterns, rich jewel colors, metallic accents (gold, chrome), lacquered surfaces, bold symmetry, velvet upholstery, sunburst motifs, mirrored surfaces, gatsby-era luxury',
    'mid-century': '1950s-60s iconic design, Eames and Saarinen furniture, organic shapes, wood paneling, bold accent colors (mustard, teal, orange), geometric patterns, sunburst clocks, kidney-shaped tables',
    'victorian': 'ornate carved furniture, rich damask and brocade fabrics, dark wood (mahogany, walnut), floral wallpaper, tufted upholstery, heavy drapery, ornamental fireplace, patterned rugs, gaslight-era charm',
    'industrial': 'exposed brick walls, metal beams and ductwork, polished concrete floors, vintage factory elements, Edison bulbs and industrial lighting, raw materials (steel, iron, reclaimed wood), leather and metal furniture, high ceilings, large factory windows',
    'rustic': 'reclaimed wood beams and flooring, stone fireplace, natural materials, warm earth tones, handcrafted elements, cozy textiles (wool, linen), farmhouse charm, antler accents, copper fixtures',
    'bohemian': 'eclectic mix of patterns and textures, rich jewel tones, layered textiles, vintage and global finds, macrame, plants everywhere, floor cushions, tapestries, free-spirited expression',
    'luxury': 'high-end materials, marble surfaces, gold and brass accents, crystal chandeliers, velvet upholstery, custom millwork, statement art pieces, professional interior styling',
    'coastal': 'light and airy, ocean-inspired colors (navy, seafoam, sand), natural textures (rope, driftwood), weathered wood, linen fabrics, nautical elements, large windows with water views',
    'contemporary': 'current design trends, mix of textures, statement lighting, bold art, comfortable luxury, curated accessories, tech integration, warm neutral base with pops of color',
    'urban-loft': 'open floor plan, soaring ceilings, exposed brick and ductwork, oversized windows with city views, polished concrete floors, industrial meets refined, art gallery walls',
    'maximalist': 'bold patterns everywhere, rich saturated colors, layered textures, eclectic art collection, statement furniture, more-is-more philosophy, curated chaos, conversation-starting pieces',
    'wabi-sabi': 'beauty in imperfection, natural patina, asymmetry, rough textures, handmade ceramics, weathered wood, earth tones, simplicity, acceptance of transience, muted natural palette',
    'brutalist': 'exposed concrete surfaces, bold geometric forms, monolithic structures, raw unfinished materials, dramatic shadows and light, minimal ornamentation, strong angular shapes',
}

ROOM_DETAILS = {
    'Living Room': 'soft textured throw pillows on a designer sofa, open coffee table books, warm morning sunlight through floor-to-ceiling windows, lush indoor plants like fiddle leaf figs, soft woven area rug, curated artwork on walls, ambient table lamps',
    'Kitchen': 'high-end marble or quartz countertops, steaming espresso machine, professional knives on magnetic strip, copper cookware hanging, wooden cutting boards, LED strips under cabinets, fresh herbs in ceramic pots, designer bar stools',
    'Bedroom': 'rumpled high-thread-count linen sheets, stack of design books on nightstand, warm bedside lighting, soft wool throw blanket, high-end drapes with realistic folds, plush pillows, modern headboard, reading chair',
    'Office': 'modern adjustable desk lamp, high-resolution monitors, ergonomic chair, personal artifacts, clean cable management, bookshelf with design books, indoor plant, minimalist desk setup',
    'Dining Room': 'designer pendant lighting, place settings with high-end dinnerware, fresh floral centerpiece, elegant upholstered chairs, wine glasses, textured table runner, ambient candlelight',
    'Bathroom': 'steam on glass shower partition, plush rolled cotton towels, luxury soap dispensers, natural stone textures, rain shower head, freestanding tub, designer fixtures, ambient lighting, fresh flowers',
}

# ============================================================
# IMAGE DEFINITIONS - All images needed for the site
# ============================================================

IMAGES = [
    # ---- BEFORE IMAGES (empty rooms) ----
    {
        "filename": "before-empty.jpg",
        "prompt": f"{QUALITY_PREFIX} An empty, unfurnished living room photographed in the style of real estate photography. Bare white walls, light hardwood flooring, large windows letting in natural daylight, no furniture, no decorations. Clean, bright, spacious but empty. The room should look like a blank canvas waiting for design. Wide-angle lens, even lighting."
    },
    {
        "filename": "before-bedroom.jpg",
        "prompt": f"{QUALITY_PREFIX} An empty, unfurnished bedroom. Bare walls painted soft white, light wood or carpet flooring, one window with natural light streaming in. No furniture, no curtains, no decorations. Empty closet door visible. The room feels blank and uninspired, ready to be transformed. Wide-angle shot."
    },
    {
        "filename": "before-kitchen.jpg",
        "prompt": f"{QUALITY_PREFIX} An empty, basic kitchen with plain white cabinets, basic countertops, no decorations, no appliances on counters, generic fluorescent lighting. The kitchen looks functional but completely uninspired and lifeless. Beige walls. Wide-angle real estate style photo."
    },
    {
        "filename": "before-study.jpg",
        "prompt": f"{QUALITY_PREFIX} An empty, unfurnished home office or study room. Bare walls, basic flooring, one window. No desk, no shelves, no furniture. Just an empty room with natural light. Clean but completely bare and uninviting."
    },

    # ---- HERO IMAGE ----
    {
        "filename": "hero-showcase.jpg",
        "prompt": f"{QUALITY_PREFIX} A breathtaking modern luxury living room that showcases the pinnacle of AI-powered interior design. Floor-to-ceiling windows overlooking a city skyline at golden hour. {STYLE_PROMPTS['modern']}. {ROOM_DETAILS['Living Room']}. The space should look absolutely stunning, like the cover of Architectural Digest. Dramatic natural lighting, perfect composition, ultra high detail on every texture and material."
    },

    # ---- AFTER/SHOWCASE IMAGES (styled transformations) ----
    {
        "filename": "after-modern.jpg",
        "prompt": f"{QUALITY_PREFIX} A beautifully designed modern minimalist living room. {STYLE_PROMPTS['modern']}. {ROOM_DETAILS['Living Room']}. The room should feel warm, inviting, and magazine-worthy. Natural sunlight streams through large windows. Every detail is perfect - from the texture of fabrics to the grain of wood. Wide-angle architectural photography."
    },
    {
        "filename": "after-scandinavian.jpg",
        "prompt": f"{QUALITY_PREFIX} A stunning Scandinavian-style bedroom. {STYLE_PROMPTS['scandinavian']}. {ROOM_DETAILS['Bedroom']}. Cozy hygge atmosphere with soft morning light filtering through sheer white curtains. The space feels serene, warm, and perfectly balanced. Professional interior photography."
    },
    {
        "filename": "after-industrial.jpg",
        "prompt": f"{QUALITY_PREFIX} A dramatic industrial-style loft kitchen. {STYLE_PROMPTS['industrial']}. {ROOM_DETAILS['Kitchen']}. High ceilings with exposed ductwork, warm Edison lighting, and a mix of raw and refined materials. The space feels urban, sophisticated, and full of character. Moody atmospheric lighting."
    },
    {
        "filename": "after-japandi.jpg",
        "prompt": f"{QUALITY_PREFIX} A serene Japandi-style home office. {STYLE_PROMPTS['japandi']}. {ROOM_DETAILS['Office']}. The space combines Japanese zen with Scandinavian functionality. Natural materials, low profile furniture, muted earth tones. Peaceful, focused, and beautifully minimal. Soft diffused natural light."
    },

    # ---- STYLE GALLERY - FEATURED (6 large cards) ----
    {
        "filename": "style-coastal.jpg",
        "prompt": f"{QUALITY_PREFIX} A dreamy coastal-style living room. {STYLE_PROMPTS['coastal']}. {ROOM_DETAILS['Living Room']}. Ocean visible through large windows. The room feels like a luxury beach house. Light, airy, and absolutely beautiful. Professional interior photography with warm afternoon light."
    },
    {
        "filename": "style-artdeco.jpg",
        "prompt": f"{QUALITY_PREFIX} A glamorous Art Deco dining room. {STYLE_PROMPTS['art-deco']}. {ROOM_DETAILS['Dining Room']}. The room exudes 1920s luxury with modern comfort. Geometric patterns, gold accents, rich velvet. Evening lighting with warm glow from crystal chandelier. Gatsby-era opulence."
    },
    {
        "filename": "style-midcentury.jpg",
        "prompt": f"{QUALITY_PREFIX} A stylish mid-century modern living room. {STYLE_PROMPTS['mid-century']}. {ROOM_DETAILS['Living Room']}. Iconic 1950s-60s furniture pieces, organic shapes, warm wood tones. The space feels retro yet timeless. Warm afternoon light through large windows. Professional design photography."
    },
    {
        "filename": "style-bohemian.jpg",
        "prompt": f"{QUALITY_PREFIX} A vibrant bohemian-style bedroom. {STYLE_PROMPTS['bohemian']}. {ROOM_DETAILS['Bedroom']}. Rich textures, eclectic patterns, warm jewel tones. Plants cascading from shelves. The room feels free-spirited, warm, and deeply personal. Soft golden light."
    },
    {
        "filename": "style-luxury.jpg",
        "prompt": f"{QUALITY_PREFIX} An ultra-luxurious master suite. {STYLE_PROMPTS['luxury']}. {ROOM_DETAILS['Bedroom']}. Marble, gold accents, crystal chandelier, velvet headboard. The room looks like a five-star hotel presidential suite. Evening mood lighting with warm glow. Absolute opulence."
    },
    {
        "filename": "style-rustic.jpg",
        "prompt": f"{QUALITY_PREFIX} A cozy rustic farmhouse kitchen. {STYLE_PROMPTS['rustic']}. {ROOM_DETAILS['Kitchen']}. Reclaimed wood, stone, copper. The kitchen feels warm, inviting, and full of character. Morning light through a window above the sink. Farmhouse charm meets modern convenience."
    },

    # ---- STYLE GALLERY - CATEGORY IMAGES (11 additional styles) ----
    {
        "filename": "style-modern.jpg",
        "prompt": f"{QUALITY_PREFIX} A pristine modern minimalist living room. {STYLE_PROMPTS['modern']}. Clean white walls, sleek low-profile furniture, single statement art piece. The room is a masterclass in restraint and elegance. Natural light floods the space. Ultra-clean lines and perfect proportions."
    },
    {
        "filename": "style-scandinavian.jpg",
        "prompt": f"{QUALITY_PREFIX} A perfect Scandinavian living room. {STYLE_PROMPTS['scandinavian']}. Light birch wood, white walls, hygge textiles. A cozy blanket draped over a simple sofa. Candlelight and natural light creating warmth. Minimalist but deeply comfortable."
    },
    {
        "filename": "style-contemporary.jpg",
        "prompt": f"{QUALITY_PREFIX} A sophisticated contemporary living room. {STYLE_PROMPTS['contemporary']}. Bold statement art on the wall, designer lighting, mix of textures. The room feels current, curated, and comfortable. Warm evening light with accent lighting."
    },
    {
        "filename": "style-urban-loft.jpg",
        "prompt": f"{QUALITY_PREFIX} A stunning urban loft apartment. {STYLE_PROMPTS['urban-loft']}. Soaring double-height ceilings, exposed brick, massive windows with city skyline views. Industrial meets refined luxury. The space feels like a New York or London creative's dream home. Dramatic golden hour light."
    },
    {
        "filename": "style-victorian.jpg",
        "prompt": f"{QUALITY_PREFIX} An elegant Victorian parlor room. {STYLE_PROMPTS['victorian']}. Rich dark wood, ornate fireplace, patterned wallpaper, crystal chandelier. The room transports you to a refined era of craftsmanship and elegance. Warm firelight and soft lamplight."
    },
    {
        "filename": "style-french-country.jpg",
        "prompt": f"{QUALITY_PREFIX} A charming French country kitchen. {STYLE_PROMPTS['french-country']}. Lavender accents, distressed white furniture, copper pots, stone floor. The room feels like a Provençal farmhouse in the south of France. Soft morning light through linen curtains."
    },
    {
        "filename": "style-mediterranean.jpg",
        "prompt": f"{QUALITY_PREFIX} A warm Mediterranean dining room. {STYLE_PROMPTS['mediterranean']}. Arched windows, terracotta tiles, wrought iron chandelier. The room feels like a villa overlooking the sea. Warm golden afternoon light flooding through arched doorways."
    },
    {
        "filename": "style-industrial.jpg",
        "prompt": f"{QUALITY_PREFIX} A bold industrial loft living space. {STYLE_PROMPTS['industrial']}. Exposed brick, steel beams, polished concrete. Factory windows flooding light. A leather Chesterfield sofa, reclaimed wood coffee table. The space feels raw, authentic, and incredibly cool."
    },
    {
        "filename": "style-maximalist.jpg",
        "prompt": f"{QUALITY_PREFIX} An exuberant maximalist living room. {STYLE_PROMPTS['maximalist']}. Bold patterned wallpaper, rich jewel-toned velvet furniture, eclectic art collection covering the walls. Every surface tells a story. The room is bursting with personality and curated chaos."
    },
    {
        "filename": "style-tropical.jpg",
        "prompt": f"{QUALITY_PREFIX} A luxurious tropical resort-style living room. {STYLE_PROMPTS['tropical']}. Rattan furniture, monstera plants, ceiling fan, open to a tropical garden. The room feels like a high-end Bali resort villa. Bright natural light with dappled shadows from palms."
    },
    {
        "filename": "style-japandi.jpg",
        "prompt": f"{QUALITY_PREFIX} A serene Japandi living room. {STYLE_PROMPTS['japandi']}. Low platform sofa, natural wood, paper shoji screen. A single bonsai tree as the focal point. The room breathes calm and intentionality. Soft diffused light creating a meditative atmosphere."
    },

    # ---- FEATURE IMAGES ----
    {
        "filename": "feature-speed.jpg",
        "prompt": f"{QUALITY_PREFIX} A dramatic split-screen architectural visualization showing an empty room on the left transforming into a beautifully designed modern interior on the right. The left side is bare walls and empty floor. The right side is a stunning modern living room with designer furniture, art, and warm lighting. A glowing line of energy separates the two halves, representing AI transformation. Dynamic, impressive, technological."
    },
    {
        "filename": "feature-chat.jpg",
        "prompt": f"{QUALITY_PREFIX} A beautifully designed modern living room showing subtle design iterations - as if an AI assistant is refining the space. The room features {STYLE_PROMPTS['modern']}. Warm natural light, professional interior photography. The image conveys the idea of intelligent, iterative design refinement. Pristine and polished."
    },
    {
        "filename": "feature-4k.jpg",
        "prompt": f"{QUALITY_PREFIX} An extreme close-up detail shot of luxury interior design materials. Show the intricate grain of Italian marble countertop, the weave of linen fabric on a designer chair, the brushed brass of a modern light fixture, and the texture of hand-troweled plaster wall — all in stunning ultra-high-definition detail. Macro photography quality. Every fiber, vein, and surface imperfection visible. This demonstrates 4K resolution quality."
    },
    {
        "filename": "feature-styles.jpg",
        "prompt": f"{QUALITY_PREFIX} A creative grid composition showing 4 different interior design styles in one image — each quadrant showing the same room but in a completely different style: top-left Modern Minimalist (white, clean), top-right Industrial (brick, metal), bottom-left Bohemian (colorful, eclectic), bottom-right Japandi (zen, wood). Clean grid lines separate each quadrant. Professional architectural photography in each section."
    },

    # ---- STUDIO IMAGES ----
    {
        "filename": "studio-welcome.jpg",
        "prompt": f"{QUALITY_PREFIX} A subtle, atmospheric background image for a design studio application. A softly blurred luxury interior space with warm ambient lighting, showing hints of modern architecture — exposed beams, floor-to-ceiling windows with golden hour light, designer furniture silhouettes. The image should be moody, dark, and atmospheric — suitable as a background that won't compete with UI elements on top of it. Cinematic depth of field with most of the image softly out of focus."
    },
]

def generate_image(image_def, index, total):
    """Generate a single image using the Gemini API."""
    filename = image_def["filename"]
    filepath = os.path.join(OUTPUT_DIR, filename)

    # Skip if already exists and is > 100KB (real image, not placeholder)
    if os.path.exists(filepath) and os.path.getsize(filepath) > 100000:
        print(f"  [{index}/{total}] SKIP {filename} (already exists, {os.path.getsize(filepath)//1024}KB)")
        return filename, True, "skipped"

    print(f"  [{index}/{total}] Generating {filename}...")

    payload = json.dumps({
        "contents": [{"parts": [{"text": image_def["prompt"]}]}],
        "generationConfig": {"responseModalities": ["IMAGE", "TEXT"]}
    }).encode("utf-8")

    req = urllib.request.Request(
        API_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    for attempt in range(3):
        try:
            start = time.time()
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = json.loads(resp.read().decode("utf-8"))

            elapsed = time.time() - start

            if "candidates" in data:
                for part in data["candidates"][0]["content"]["parts"]:
                    if "inlineData" in part:
                        img_data = base64.b64decode(part["inlineData"]["data"])
                        # Save as PNG (the API returns PNG)
                        png_path = filepath.replace('.jpg', '.png') if filepath.endswith('.jpg') else filepath
                        # Actually save with the original filename
                        with open(filepath, "wb") as f:
                            f.write(img_data)
                        size_kb = len(img_data) // 1024
                        print(f"  [{index}/{total}] OK {filename} ({size_kb}KB, {elapsed:.1f}s)")
                        return filename, True, f"{size_kb}KB"

            error_msg = data.get("error", {}).get("message", "No image in response")
            print(f"  [{index}/{total}] WARN {filename}: {error_msg}")
            if attempt < 2:
                time.sleep(2)
                continue
            return filename, False, error_msg

        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8") if e.fp else str(e)
            print(f"  [{index}/{total}] HTTP {e.code} for {filename}: {error_body[:200]}")
            if e.code == 429 and attempt < 2:
                print(f"  [{index}/{total}] Rate limited, waiting 10s...")
                time.sleep(10)
                continue
            if e.code >= 500 and attempt < 2:
                time.sleep(5)
                continue
            return filename, False, f"HTTP {e.code}"
        except Exception as e:
            print(f"  [{index}/{total}] ERROR {filename}: {e}")
            if attempt < 2:
                time.sleep(3)
                continue
            return filename, False, str(e)

    return filename, False, "Max retries exceeded"


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    total = len(IMAGES)
    print(f"\n{'='*60}")
    print(f"  Nano Banana Pro Image Generator")
    print(f"  Model: {MODEL}")
    print(f"  Images to generate: {total}")
    print(f"  Output: {OUTPUT_DIR}")
    print(f"{'='*60}\n")

    # Use ThreadPoolExecutor for concurrent generation
    max_workers = 3  # 3 concurrent requests
    results = []

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {}
        for i, img_def in enumerate(IMAGES, 1):
            future = executor.submit(generate_image, img_def, i, total)
            futures[future] = img_def["filename"]

        for future in as_completed(futures):
            filename, success, info = future.result()
            results.append((filename, success, info))

    # Summary
    succeeded = sum(1 for _, s, _ in results if s)
    failed = sum(1 for _, s, info in results if not s)
    skipped = sum(1 for _, s, info in results if s and info == "skipped")

    print(f"\n{'='*60}")
    print(f"  RESULTS: {succeeded} OK, {failed} FAILED, {skipped} SKIPPED")
    print(f"{'='*60}")

    if failed:
        print("\n  Failed images:")
        for filename, success, info in results:
            if not success:
                print(f"    - {filename}: {info}")

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
