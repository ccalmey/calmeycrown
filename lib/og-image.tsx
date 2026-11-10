import { ImageResponse } from "next/og";

// Shared layout keeps generated social cards consistent while each page supplies its own copy.
export function createPortfolioOgImage({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          padding: "64px 76px",
          color: "#f7f2e8",
          background: "linear-gradient(132deg, #0b0f12 0%, #11191d 64%, #251c12 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "8px",
            background: "linear-gradient(90deg, #f8b83f 0%, #d99a34 48%, #f8b83f 100%)",
          }}
        />
        <div style={{ display: "flex", position: "absolute", top: "64px", left: "76px", right: "76px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                width: "46px",
                height: "46px",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #d9a83e",
                borderRadius: "50%",
                color: "#f8b83f",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              CC
            </div>
            <span style={{ marginLeft: "16px", fontSize: "17px", fontWeight: 700, letterSpacing: "5px" }}>
              CALMEY CROWN
            </span>
          </div>
          <span style={{ color: "#b9b5aa", fontSize: "15px", letterSpacing: "2px" }}>
            CALMEYCROWN.COM
          </span>
        </div>

        <div style={{ display: "flex", position: "absolute", top: "218px", left: "76px", right: "76px", maxWidth: "1048px", flexDirection: "column" }}>
          <span style={{ marginBottom: "18px", color: "#f8b83f", fontSize: "16px", fontWeight: 700, letterSpacing: "4px" }}>
            {eyebrow.toUpperCase()}
          </span>
          <div style={{ fontSize: title.length > 28 ? "54px" : "70px", fontWeight: 700, letterSpacing: "-3px", lineHeight: 1.08 }}>
            {title}
          </div>
          <p style={{ maxWidth: "830px", margin: "22px 0 0", color: "#d0ccc3", fontSize: "24px", lineHeight: 1.45 }}>
            {description}
          </p>
        </div>

        <div style={{ display: "flex", position: "absolute", right: "76px", bottom: "64px", left: "76px", alignItems: "center", width: "100%" }}>
          <div style={{ width: "72px", height: "2px", background: "#f8b83f" }} />
          <span style={{ marginLeft: "18px", color: "#a9a59c", fontSize: "15px", letterSpacing: "2px" }}>
            TECHNOLOGY · STORYTELLING · CREATIVE WORK
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
