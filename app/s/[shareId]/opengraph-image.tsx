import { readFile } from "node:fs/promises";
import { join } from "node:path";
import React from "react";
import { ImageResponse } from "next/og";
import { getShare } from "./mock-data";

// 1200×630 social card rendered per share — what unfurls in iMessage / WhatsApp
// / X / LinkedIn and feeds the iOS share-sheet preview. Designed to stay legible
// when shrunk to a chat bubble: few elements, big type, lots of air. Built with
// React.createElement (JSX crashes this metadata route's compiler). Satori can't
// run WebGL, so the real shader orb is composited from a pre-rendered PNG.
export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "A visualization shared on Aya";

type Params = { params: Promise<{ shareId: string }> };
const h = React.createElement;
const BRAND = "#8E6B7F";
const INK = "#3D2B34";

async function loadFont(file: string) {
  return readFile(join(process.cwd(), "app/s/[shareId]/og-fonts", file));
}

export default async function Image({ params }: Params) {
  try {
    const { shareId } = await params;
    const share = await getShare(shareId);
    const noun = share.type === "subliminal" ? "subliminal" : "visualization";

    const [semibold, medium, italic] = await Promise.all([
      loadFont("Cormorant-SemiBold.ttf"),
      loadFont("Cormorant-Medium.ttf"),
      loadFont("Cormorant-SemiBoldItalic.ttf"),
    ]);

    // The real WebGL orb, pre-rendered to a transparent PNG (Satori can't run
    // WebGL), composited in as the authentic centerpiece.
    const orbPng = await readFile(join(process.cwd(), "public/og-orb.png"));
    const orbSrc = `data:image/png;base64,${orbPng.toString("base64")}`;

    const tree = h(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 90,
          fontFamily: "Cormorant",
          color: INK,
          backgroundImage:
            "linear-gradient(135deg, #F2ECFD 0%, #FBE2EF 52%, #FFE6D6 100%)",
        },
      },
      // top-light wash
      h("div", {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "radial-gradient(55% 45% at 50% 0%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
        },
      }),
      // orb (real shader image) + glow + play disc
      h(
        "div",
        {
          style: {
            position: "absolute",
            top: 115,
            right: 74,
            width: 400,
            height: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        },
        h("div", {
          style: {
            position: "absolute",
            width: 320,
            height: 320,
            borderRadius: 320,
            boxShadow: "0 30px 130px 18px rgba(171,158,245,0.6)",
          },
        }),
        h("img", {
          src: orbSrc,
          width: 400,
          height: 400,
          style: { position: "absolute" },
        }),
        h(
          "div",
          {
            style: {
              width: 116,
              height: 116,
              borderRadius: 116,
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 16px 38px rgba(61,43,52,0.3)",
            },
          },
          h(
            "svg",
            { width: 46, height: 46, viewBox: "0 0 24 24", style: { marginLeft: 7 } },
            h("path", { d: "M8 5v14l11-7z", fill: INK })
          )
        )
      ),
      // headline column
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", maxWidth: 600 } },
        h(
          "div",
          { style: { fontSize: 28, fontWeight: 500, letterSpacing: 6, color: BRAND } },
          "SHARED WITH YOU"
        ),
        h(
          "div",
          { style: { marginTop: 24, fontSize: 58, fontWeight: 600, lineHeight: 1.1 } },
          `${share.creatorName} shared a`
        ),
        h(
          "div",
          { style: { fontSize: 58, fontWeight: 600, lineHeight: 1.1 } },
          `${noun} with you`
        ),
        h(
          "div",
          {
            style: {
              marginTop: 28,
              fontSize: 52,
              fontWeight: 600,
              fontStyle: "italic",
              color: BRAND,
            },
          },
          `“${share.title}”`
        )
      ),
      // footer: single CTA
      h(
        "div",
        { style: { display: "flex" } },
        h(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              padding: "24px 56px",
              borderRadius: 999,
              background: BRAND,
              color: "#ffffff",
              fontSize: 40,
              fontWeight: 600,
              boxShadow: "0 18px 40px -12px rgba(142,107,127,0.7)",
            },
          },
          h(
            "svg",
            { width: 30, height: 30, viewBox: "0 0 24 24", style: { marginRight: 16 } },
            h("path", { d: "M8 5v14l11-7z", fill: "#ffffff" })
          ),
          "Listen on Aya Now"
        )
      )
    );

    return new ImageResponse(tree, {
      ...size,
      fonts: [
        { name: "Cormorant", data: semibold, weight: 600, style: "normal" },
        { name: "Cormorant", data: medium, weight: 500, style: "normal" },
        { name: "Cormorant", data: italic, weight: 600, style: "italic" },
      ],
    });
  } catch (e) {
    return new Response(
      "OG_ERROR\n" + (e instanceof Error ? `${e.message}\n${e.stack}` : String(e)),
      { status: 200, headers: { "content-type": "text/plain" } }
    );
  }
}
