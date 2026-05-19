const APP_STORE_URL =
  "https://apps.apple.com/us/app/aya-manifest-your-dream-self/id6760195623";
const PLAY_STORE_URL = "https://www.fromkuskus.com/";

export function StoreBadges({ align = "start" }: { align?: "start" | "center" }) {
  return (
    <div
      className={`flex flex-wrap gap-3 ${
        align === "center" ? "justify-center" : "justify-start"
      }`}
    >
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download Aya on the App Store"
        className="group inline-flex items-center gap-3 rounded-2xl bg-black text-white px-5 py-3 hover:bg-neutral-800 transition-colors"
      >
        <svg viewBox="0 0 384 512" className="w-7 h-7 fill-current" aria-hidden>
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM256.8 84.4C290.2 44.7 287.2 8.5 286.2 0 257 1.7 223.3 19.8 204.1 42.1c-21.1 23.9-33.5 53.5-30.8 86.7 31.6 2.4 60.4-13.9 83.5-44.4z" />
        </svg>
        <span className="leading-tight text-left">
          <span className="block text-[10px] tracking-widest uppercase opacity-80">
            Download on the
          </span>
          <span className="block text-lg font-semibold -mt-0.5">App Store</span>
        </span>
      </a>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get Aya on Google Play"
        className="group inline-flex items-center gap-3 rounded-2xl bg-black text-white px-5 py-3 hover:bg-neutral-800 transition-colors"
      >
        <svg viewBox="0 0 512 512" className="w-7 h-7" aria-hidden>
          <path fill="#34D399" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" />
          <path
            fill="#60A5FA"
            d="M104.6 13c-7.4 3.8-12.6 11.2-12.6 21.9v442.2c0 10.7 5.2 18.1 12.6 21.9l218-228.7L104.6 13z"
          />
          <path fill="#F87171" d="M385.4 337.6L325.3 277.6 104.6 499l280.8-161.4z" />
          <path
            fill="#FBBF24"
            d="M457.9 236.7l-72.4-41.6-66.7 60.9 66.7 60.9 72.4-41.6c20.5-11.8 20.5-46.8 0-58.6z"
          />
        </svg>
        <span className="leading-tight text-left">
          <span className="block text-[10px] tracking-widest uppercase opacity-80">
            Get it on
          </span>
          <span className="block text-lg font-semibold -mt-0.5">Google Play</span>
        </span>
      </a>
    </div>
  );
}
