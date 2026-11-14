import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

/**
 * RiversAtlas — lazy Leaflet map used on the rivers pages.
 * Tiles come from OpenStreetMap (CC-BY-SA). Leaflet is code-split only
 * when the atlas is requested so the rivers shell stays small.
 */
export default function RiversAtlas({ systems = [], label = "River atlas" }) {
  const ref = useRef(null);
  const [Leaflet, setLeaflet] = useState(null);
  // Rebuild the map whenever the visible river systems change, but keep a
  // primitive dependency so parent re-renders don't recreate it.
  const systemKey = [...systems].sort().join("|");

  useEffect(() => {
    (async () => {
      try {
        const mod = await import("leaflet");
        setLeaflet(mod.default || mod);
      } catch {
        // map is non-blocking
      }
    })();
  }, []);

  useEffect(() => {
    if (!Leaflet || !ref.current) return;
    const map = Leaflet.map(ref.current, { scrollWheelZoom: false }).setView(
      [26.49, 91.84],
      7
    );
    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);
    for (const sys of systemKey ? systemKey.split("|") : []) {
      const where = sys === "brahmaputra" ? [27.0, 90.5] : sys === "barak" ? [24.8, 92.8] : [26.49, 91.84];
      Leaflet.circleMarker(where, { radius: 8, color: "#9c4a1f", weight: 2, fillColor: "#9c4a1f", fillOpacity: 0.85 }).addTo(map);
    }
    return () => map.remove();
  }, [Leaflet, systemKey]);

  return (
    <div
      ref={ref}
      className="rivers__atlas"
      role="application"
      aria-label={label}
    ></div>
  );
}
