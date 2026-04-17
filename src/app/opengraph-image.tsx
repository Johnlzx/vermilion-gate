import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "radial-gradient(circle at top left, rgba(159, 52, 39, 0.18), transparent 48%), linear-gradient(135deg, #f4efe8 0%, #efe8df 50%, #f7f2eb 100%)",
          color: "#152131",
          padding: "56px",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "36px",
            border: "1px solid rgba(21, 33, 49, 0.1)",
            borderRadius: "28px",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "72px",
                height: "72px",
                borderRadius: "16px",
                background: "#9f3427",
                color: "#fdfaf5",
                fontSize: "28px",
                fontWeight: 700,
                letterSpacing: "-0.08em",
              }}
            >
              VG
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "24px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#6b6f76",
                }}
              >
                Vermilion Gate
              </span>
              <span
                style={{
                  fontSize: "24px",
                  color: "#6b6f76",
                }}
              >
                Singapore-based strategic advisory
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "860px",
            }}
          >
            <span
              style={{
                fontSize: "84px",
                lineHeight: 0.95,
                letterSpacing: "-0.06em",
              }}
            >
              We structure what others cannot yet fund.
            </span>
            <span
              style={{
                fontSize: "28px",
                lineHeight: 1.4,
                color: "#53606d",
                maxWidth: "780px",
              }}
            >
              Founder-led advisory platform for strategic transactions, capital
              alignment, capital allocation strategy, and special situations.
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
