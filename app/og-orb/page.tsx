"use client";

// Dev-only: renders ONLY the real WebGL orb on a transparent background so we
// can screenshot it to a static PNG (public/og-orb.png) and composite the
// authentic orb into the Satori-rendered OG card (Satori can't run WebGL).
import { Orb } from "../s/[shareId]/orb";

export default function OgOrbCapture() {
  return (
    <>
      <style>{`html,body{background:transparent !important;margin:0}`}</style>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <Orb playing size={760} />
      </div>
    </>
  );
}
