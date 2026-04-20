import fs from "node:fs";
import path from "node:path";

import { ImageResponse } from "next/og";

import { loadInter } from "@/lib/og/fonts";
import { company } from "@/lib/site-content";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";
export const ogAlt = `${company.name} — ${company.description}`;

const INK = "#152131";
const MUTED = "#53606d";
const PAPER_GRADIENT =
  "linear-gradient(135deg, #f4efe8 0%, #efe8df 50%, #f7f2eb 100%)";
const HALO =
  "radial-gradient(circle at top left, rgba(159, 52, 39, 0.18), transparent 48%)";

const logoSvg = fs
  .readFileSync(
    path.join(process.cwd(), "public/assets/vermilion-gate-logo.svg"),
    "utf8",
  )
  .replace(/#FFFFFF/gi, INK);
const logoDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(logoSvg)}`;

export async function renderSiteOg() {
  const fonts = await loadInter([400, 600]);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: `${HALO}, ${PAPER_GRADIENT}`,
          color: INK,
          padding: 80,
          fontFamily: "Inter",
          position: "relative",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 36,
            border: "1px solid rgba(21, 33, 49, 0.1)",
            borderRadius: 28,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 48,
            maxWidth: 1020,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoDataUri} width={420} height={60} alt={company.name} />
            <span
              style={{
                fontSize: 26,
                fontWeight: 400,
                color: MUTED,
                paddingLeft: 2,
              }}
            >
              Singapore-based strategic advisory
            </span>
          </div>

          <span
            style={{
              fontSize: 80,
              fontWeight: 600,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              color: INK,
              whiteSpace: "pre-line",
            }}
          >
            {"We structure what others\ncannot yet fund."}
          </span>
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}
