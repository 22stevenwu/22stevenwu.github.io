import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { geoGraticule10, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldData from "world-atlas/countries-110m.json";
import type { TravelDestination } from "@/data/travel";

const mapWidth = 1000;
const mapHeight = 520;

const worldTopology = worldData as unknown as Topology<{
  countries: GeometryCollection;
}>;
const countries = feature(worldTopology, worldTopology.objects.countries);
const projection = geoNaturalEarth1().fitExtent(
  [
    [22, 18],
    [mapWidth - 22, mapHeight - 18],
  ],
  { type: "Sphere" },
);
const drawPath = geoPath(projection);
const spherePath = drawPath({ type: "Sphere" }) ?? undefined;
const graticulePath = drawPath(geoGraticule10()) ?? undefined;

const visitedCountryIds = new Set([
  "124", // Canada
  "158", // Taiwan
  "214", // Dominican Republic
  "392", // Japan
  "410", // South Korea
  "704", // Vietnam
  "840", // United States
]);

function projectPoint(destination: TravelDestination) {
  const point = projection([destination.coordinates.lng, destination.coordinates.lat]);
  if (!point) return null;

  return {
    x: point[0] + (destination.pinOffset?.x ?? 0),
    y: point[1] + (destination.pinOffset?.y ?? 0),
  };
}

export function TravelMap({ destinations }: { destinations: TravelDestination[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const activeDestination = activeIndex === null ? null : destinations[activeIndex];
  const activePhoto = activeDestination?.photos[activePhotoIndex];

  const selectDestination = (index: number) => {
    setActiveIndex(index);
    setActivePhotoIndex(0);
  };

  const shiftPhoto = (direction: number) => {
    if (!activeDestination) return;
    setActivePhotoIndex(
      (current) =>
        (current + direction + activeDestination.photos.length) % activeDestination.photos.length,
    );
  };

  return (
    <div className="travel-map relative overflow-hidden rounded-2xl border border-border bg-secondary/30">
      <svg
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        className="block h-auto w-full"
        role="group"
        aria-label="Interactive map of travel destinations"
      >
        <title>Travel destinations</title>
        <defs>
          <linearGradient id="travel-map-ocean" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-primary)" stopOpacity="0.08" />
            <stop offset="0.5" stopColor="var(--color-card)" stopOpacity="0.72" />
            <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        <path
          d={spherePath}
          fill="url(#travel-map-ocean)"
          stroke="var(--color-border)"
          strokeWidth="1.5"
        />
        <path
          d={graticulePath}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="0.75"
          opacity="0.5"
        />

        <g stroke="var(--color-border)" strokeWidth="0.85" strokeLinejoin="round">
          {countries.features.map((country, index) => {
            const isVisited = visitedCountryIds.has(String(country.id));

            return (
              <path
                key={country.id ?? index}
                d={drawPath(country) ?? undefined}
                fill={isVisited ? "var(--color-primary)" : "var(--color-card)"}
                fillOpacity={isVisited ? 0.16 : 0.94}
              />
            );
          })}
        </g>

        {destinations.map((destination, index) => {
          const point = projectPoint(destination);
          if (!point) return null;
          const isActive = index === activeIndex;

          return (
            <g
              key={destination.id}
              transform={`translate(${point.x} ${point.y})`}
              role="button"
              tabIndex={0}
              aria-label={`Show photos from ${destination.label}`}
              aria-pressed={isActive}
              onClick={() => selectDestination(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  selectDestination(index);
                }
              }}
              className={`map-marker cursor-pointer outline-none ${isActive ? "is-active" : ""}`}
            >
              <title>{destination.label}</title>
              <circle r="22" fill="transparent" />
              {isActive ? (
                <circle className="map-marker-pulse" r="13" fill="none" stroke="var(--color-primary)" />
              ) : null}
              <g className="map-marker-visual">
                <circle
                  className="map-marker-focus"
                  r="10"
                  fill="var(--color-card)"
                  stroke="var(--color-border)"
                  strokeWidth="2"
                />
                <circle r="5" fill="var(--color-primary)" />
              </g>
            </g>
          );
        })}
      </svg>

      {activeDestination && activePhoto ? (
        <div
          key={activeDestination.id}
          className="map-photo-popup relative mx-3 mb-3 overflow-hidden rounded-xl border border-border bg-card shadow-xl sm:absolute sm:bottom-4 sm:left-4 sm:m-0 sm:w-80"
          role="dialog"
          aria-label={`${activeDestination.label} photos`}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
            {activePhoto.fit === "contain" ? (
              <img
                key={`${activeDestination.id}-${activePhotoIndex}-backdrop`}
                src={activePhoto.src}
                alt=""
                aria-hidden="true"
                className="map-popup-backdrop absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-xl"
              />
            ) : null}
            <img
              key={`${activeDestination.id}-${activePhotoIndex}`}
              src={activePhoto.src}
              alt={activePhoto.place}
              decoding="async"
              style={{
                objectFit: activePhoto.fit ?? "cover",
                objectPosition: activePhoto.position ?? "center",
              }}
              className="map-popup-image relative z-[1] h-full w-full"
            />
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="Close photo preview"
              className="absolute right-2 top-2 z-30 flex size-8 items-center justify-center rounded-full bg-black/45 text-white/85 backdrop-blur transition-colors hover:bg-black/65 hover:text-white"
            >
              <X className="size-4" />
            </button>

            {activeDestination.photos.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => shiftPhoto(-1)}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 z-30 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white/85 backdrop-blur transition-colors hover:bg-black/65 hover:text-white"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => shiftPhoto(1)}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 z-30 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white/85 backdrop-blur transition-colors hover:bg-black/65 hover:text-white"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            ) : null}

            <div className="absolute inset-x-3 bottom-3 z-20 flex items-end justify-between gap-3 text-white">
              <p className="text-sm font-medium leading-snug">{activePhoto.place}</p>
              <p className="shrink-0 font-mono text-[0.62rem] text-white/75">
                {activePhotoIndex + 1}/{activeDestination.photos.length}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between gap-3 px-3 py-2.5">
            <p className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
              <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">{activeDestination.label}</span>
            </p>
            {activeDestination.photos.length > 1 ? (
              <div className="flex shrink-0 gap-1.5" aria-label="Choose a photo">
                {activeDestination.photos.map((photo, index) => (
                  <button
                    key={photo.place}
                    type="button"
                    onClick={() => setActivePhotoIndex(index)}
                    aria-label={`Show photo ${index + 1}: ${photo.place}`}
                    aria-current={index === activePhotoIndex ? "true" : undefined}
                    className={`size-1.5 rounded-full transition-[width,background-color] duration-300 ${
                      index === activePhotoIndex ? "w-4 bg-primary" : "bg-border hover:bg-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <p className="absolute right-2 top-2 rounded-full border border-border bg-card/85 px-2.5 py-1 font-mono text-[0.56rem] uppercase tracking-wider text-muted-foreground shadow-sm backdrop-blur sm:right-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[0.62rem]">
        {activeDestination ? "Select another pin" : "Select a pin"}
      </p>
    </div>
  );
}
