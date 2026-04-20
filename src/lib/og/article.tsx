import fs from "node:fs";
import path from "node:path";

import { ImageResponse } from "next/og";

import { loadInter } from "@/lib/og/fonts";
import { company } from "@/lib/site-content";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const BRAND = "#9f3427";
const INK = "#152131";
const MUTED = "#53606d";
const PAPER_GRADIENT =
  "linear-gradient(135deg, #f4efe8 0%, #efe8df 50%, #f7f2eb 100%)";
const HALO =
  "radial-gradient(circle at bottom right, rgba(159, 52, 39, 0.16), transparent 52%)";

const logoSvg = fs
  .readFileSync(
    path.join(process.cwd(), "public/assets/vermilion-gate-logo.svg"),
    "utf8",
  )
  .replace(/#FFFFFF/gi, INK);
const logoDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(logoSvg)}`;

export type ArticleOgProps = {
  title: string;
  kicker?: string;
  date?: string | Date;
  author?: string;
  readTime?: string;
};

function clampTitleSize(title: string): number {
  const len = title.length;
  if (len <= 40) return 84;
  if (len <= 70) return 70;
  if (len <= 110) return 58;
  return 48;
}

function formatDate(input?: string | Date): string | undefined {
  if (!input) return undefined;
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return typeof input === "string" ? input : undefined;
  return d.toLocaleDateString("en-SG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function renderArticleOg({
  title,
  kicker = "Insight",
  date,
  author = company.name,
  readTime,
}: ArticleOgProps) {
  const titleSize = clampTitleSize(title);
  const dateLabel = formatDate(date);
  const meta = [author, dateLabel, readTime].filter(Boolean).join("  ·  ");
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
          padding: 56,
          fontFamily: "Inter",
          position: "relative",
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
            position: "absolute",
            top: 36,
            left: 36,
            width: 6,
            height: "calc(100% - 72px)",
            background: BRAND,
            borderTopLeftRadius: 28,
            borderBottomLeftRadius: 28,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "28px 32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoDataUri}
              width={280}
              height={40}
              alt={company.name}
            />
            <span
              style={{
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: BRAND,
              }}
            >
              {kicker}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1000 }}>
            <span
              style={{
                fontSize: titleSize,
                fontWeight: 600,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                color: INK,
              }}
            >
              {title}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 22,
              fontWeight: 400,
              color: MUTED,
            }}
          >
            <span>{meta}</span>
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}
