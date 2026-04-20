type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

type LoadedFont = {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight;
  style: "normal";
};

const TTF_HEADERS = {
  // Force Google Fonts to return TTF (not WOFF2) — satori cannot decode WOFF2.
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)",
};

async function fetchInterTtf(weight: FontWeight): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}`,
    { headers: TTF_HEADERS },
  ).then((r) => r.text());
  const match = css.match(/src:\s*url\((https:\/\/[^)]+)\)\s*format\('truetype'\)/);
  if (!match) throw new Error(`Inter ${weight}: TTF URL not found`);
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

export async function loadInter(
  weights: FontWeight[] = [400, 600],
): Promise<LoadedFont[]> {
  try {
    const buffers = await Promise.all(weights.map(fetchInterTtf));
    return weights.map((weight, i) => ({
      name: "Inter",
      data: buffers[i],
      weight,
      style: "normal",
    }));
  } catch (err) {
    console.warn("[og] Inter font load failed; falling back to satori default", err);
    return [];
  }
}
