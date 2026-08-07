import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ChevronRight, MapPin, Minus, Plus, RotateCcw, X } from "lucide-react";
import { geoGraticule10, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldData from "world-atlas/countries-110m.json";
import type { TravelDestination } from "@/data/travel";

const mapWidth = 1000;
const mapHeight = 520;
const minMapZoom = 1;
const maxMapZoom = 4;
const mapZoomLevels = [1, 1.5, 2, 3, 4];

type Point = { x: number; y: number };
type MapViewport = Point & { scale: number };
type GestureOrigin = {
  viewport: MapViewport;
  midpoint: Point;
  distance: number;
  pointerCount: number;
};

const initialViewport: MapViewport = { scale: minMapZoom, x: 0, y: 0 };

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function constrainViewport(viewport: MapViewport): MapViewport {
  const scale = clamp(viewport.scale, minMapZoom, maxMapZoom);

  return {
    scale,
    x: clamp(viewport.x, mapWidth * (1 - scale), 0),
    y: clamp(viewport.y, mapHeight * (1 - scale), 0),
  };
}

function getSvgPoint(svg: SVGSVGElement, clientX: number, clientY: number): Point {
  const bounds = svg.getBoundingClientRect();

  return {
    x: ((clientX - bounds.left) / bounds.width) * mapWidth,
    y: ((clientY - bounds.top) / bounds.height) * mapHeight,
  };
}

function getGestureMetrics(points: Point[]) {
  const first = points[0];
  const second = points[1];

  if (!second) {
    return { midpoint: first, distance: 0 };
  }

  return {
    midpoint: {
      x: (first.x + second.x) / 2,
      y: (first.y + second.y) / 2,
    },
    distance: Math.hypot(second.x - first.x, second.y - first.y),
  };
}

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
const countryPaths = countries.features.map((country, index) => ({
  key: country.id ?? index,
  path: drawPath(country) ?? undefined,
  isVisited: visitedCountryIds.has(String(country.id)),
}));

function projectPoint(destination: TravelDestination) {
  const point = projection([destination.coordinates.lng, destination.coordinates.lat]);
  if (!point) return null;

  return {
    x: point[0] + (destination.pinOffset?.x ?? 0),
    y: point[1] + (destination.pinOffset?.y ?? 0),
  };
}

export function TravelMap({ destinations }: { destinations: TravelDestination[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const viewportRef = useRef<MapViewport>(initialViewport);
  const pointerPositionsRef = useRef(new Map<number, Point>());
  const gestureOriginRef = useRef<GestureOrigin | null>(null);
  const gestureMovedRef = useRef(false);
  const suppressClickUntilRef = useRef(0);
  const viewportAnimationRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [viewport, setViewport] = useState<MapViewport>(initialViewport);
  const [isDragging, setIsDragging] = useState(false);
  const activeDestination = activeIndex === null ? null : destinations[activeIndex];
  const activePhoto = activeDestination?.photos[activePhotoIndex];
  const isZoomed = viewport.scale > minMapZoom + 0.001;

  const cancelViewportAnimation = useCallback(() => {
    if (viewportAnimationRef.current === null) return;
    cancelAnimationFrame(viewportAnimationRef.current);
    viewportAnimationRef.current = null;
  }, []);

  const updateViewport = useCallback((nextViewport: MapViewport) => {
    const constrainedViewport = constrainViewport(nextViewport);
    viewportRef.current = constrainedViewport;
    setViewport(constrainedViewport);
  }, []);

  const getViewportAtScale = useCallback(
    (requestedScale: number, focus: Point = { x: mapWidth / 2, y: mapHeight / 2 }) => {
      const current = viewportRef.current;
      const scale = clamp(requestedScale, minMapZoom, maxMapZoom);
      const ratio = scale / current.scale;

      return constrainViewport({
        scale,
        x: focus.x - (focus.x - current.x) * ratio,
        y: focus.y - (focus.y - current.y) * ratio,
      });
    },
    [],
  );

  const zoomAtPoint = useCallback(
    (requestedScale: number, focus?: Point) => {
      updateViewport(getViewportAtScale(requestedScale, focus));
    },
    [getViewportAtScale, updateViewport],
  );

  const animateViewportTo = useCallback(
    (requestedViewport: MapViewport) => {
      const target = constrainViewport(requestedViewport);
      const start = viewportRef.current;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      cancelViewportAnimation();

      if (prefersReducedMotion) {
        updateViewport(target);
        return;
      }

      const startedAt = performance.now();
      const duration = 420;

      const tick = (now: number) => {
        const progress = clamp((now - startedAt) / duration, 0, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 4);

        updateViewport({
          scale: start.scale + (target.scale - start.scale) * easedProgress,
          x: start.x + (target.x - start.x) * easedProgress,
          y: start.y + (target.y - start.y) * easedProgress,
        });

        if (progress < 1) {
          viewportAnimationRef.current = requestAnimationFrame(tick);
        } else {
          viewportAnimationRef.current = null;
        }
      };

      viewportAnimationRef.current = requestAnimationFrame(tick);
    },
    [cancelViewportAnimation, updateViewport],
  );

  useEffect(() => cancelViewportAnimation, [cancelViewportAnimation]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const handleWheel = (event: WheelEvent) => {
      const currentScale = viewportRef.current.scale;
      const zoomingIn = event.deltaY < 0;
      const isAtLimit =
        (zoomingIn && currentScale >= maxMapZoom) ||
        (!zoomingIn && currentScale <= minMapZoom);

      if (isAtLimit) {
        if (event.ctrlKey) event.preventDefault();
        return;
      }

      event.preventDefault();
      cancelViewportAnimation();
      const deltaMultiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? mapHeight : 1;
      const normalizedDelta = event.deltaY * deltaMultiplier;
      const nextScale = currentScale * Math.exp(-normalizedDelta * 0.0015);

      zoomAtPoint(nextScale, getSvgPoint(svg, event.clientX, event.clientY));
    };

    svg.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      svg.removeEventListener("wheel", handleWheel);
    };
  }, [cancelViewportAnimation, zoomAtPoint]);

  const resetGestureOrigin = () => {
    const points = Array.from(pointerPositionsRef.current.values()).slice(0, 2);

    if (points.length === 0) {
      gestureOriginRef.current = null;
      return;
    }

    const metrics = getGestureMetrics(points);
    gestureOriginRef.current = {
      viewport: viewportRef.current,
      midpoint: metrics.midpoint,
      distance: metrics.distance,
      pointerCount: points.length,
    };
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (pointerPositionsRef.current.size >= 2) return;

    if (pointerPositionsRef.current.size === 0) {
      cancelViewportAnimation();
      gestureMovedRef.current = false;
    }

    pointerPositionsRef.current.set(
      event.pointerId,
      getSvgPoint(event.currentTarget, event.clientX, event.clientY),
    );
    resetGestureOrigin();
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!pointerPositionsRef.current.has(event.pointerId)) return;

    pointerPositionsRef.current.set(
      event.pointerId,
      getSvgPoint(event.currentTarget, event.clientX, event.clientY),
    );

    const origin = gestureOriginRef.current;
    if (!origin) return;

    const points = Array.from(pointerPositionsRef.current.values()).slice(0, 2);
    const metrics = getGestureMetrics(points);
    const midpointMovement = Math.hypot(
      metrics.midpoint.x - origin.midpoint.x,
      metrics.midpoint.y - origin.midpoint.y,
    );
    const distanceMovement = Math.abs(metrics.distance - origin.distance);
    const mapUnitsPerPixel = mapWidth / event.currentTarget.getBoundingClientRect().width;
    const dragThreshold = (event.pointerType === "touch" ? 8 : 4) * mapUnitsPerPixel;
    const hasMoved = midpointMovement > dragThreshold || distanceMovement > dragThreshold;

    if (origin.pointerCount === 1 && origin.viewport.scale <= minMapZoom) return;
    if (!hasMoved && !gestureMovedRef.current) return;

    gestureMovedRef.current = true;
    setIsDragging(true);

    for (const pointerId of pointerPositionsRef.current.keys()) {
      if (!event.currentTarget.hasPointerCapture(pointerId)) {
        event.currentTarget.setPointerCapture(pointerId);
      }
    }

    if (origin.pointerCount >= 2 && origin.distance > 0) {
      const scale = clamp(
        origin.viewport.scale * (metrics.distance / origin.distance),
        minMapZoom,
        maxMapZoom,
      );
      const worldPoint = {
        x: (origin.midpoint.x - origin.viewport.x) / origin.viewport.scale,
        y: (origin.midpoint.y - origin.viewport.y) / origin.viewport.scale,
      };

      updateViewport({
        scale,
        x: metrics.midpoint.x - worldPoint.x * scale,
        y: metrics.midpoint.y - worldPoint.y * scale,
      });
      return;
    }

    updateViewport({
      ...origin.viewport,
      x: origin.viewport.x + metrics.midpoint.x - origin.midpoint.x,
      y: origin.viewport.y + metrics.midpoint.y - origin.midpoint.y,
    });
  };

  const handlePointerEnd = (event: ReactPointerEvent<SVGSVGElement>) => {
    pointerPositionsRef.current.delete(event.pointerId);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (pointerPositionsRef.current.size > 0) {
      resetGestureOrigin();
      return;
    }

    gestureOriginRef.current = null;
    setIsDragging(false);

    if (gestureMovedRef.current) {
      suppressClickUntilRef.current = Date.now() + 400;
    }
  };

  const changeZoomLevel = (direction: 1 | -1) => {
    const currentScale = viewportRef.current.scale;
    const levels = direction === 1 ? mapZoomLevels : [...mapZoomLevels].reverse();
    const nextScale = levels.find((level) =>
      direction === 1 ? level > currentScale + 0.01 : level < currentScale - 0.01,
    );

    animateViewportTo(
      getViewportAtScale(nextScale ?? (direction === 1 ? maxMapZoom : minMapZoom)),
    );
  };

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
        ref={svgRef}
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        className={`travel-map-canvas block h-auto w-full ${isZoomed ? "is-zoomed" : ""} ${
          isDragging ? "is-dragging" : ""
        }`}
        role="group"
        aria-label="Interactive map of travel destinations"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClickCapture={(event) => {
          if (Date.now() >= suppressClickUntilRef.current) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClickUntilRef.current = 0;
        }}
      >
        <title>Travel destinations</title>
        <defs>
          <linearGradient id="travel-map-ocean" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-primary)" stopOpacity="0.08" />
            <stop offset="0.5" stopColor="var(--color-card)" stopOpacity="0.72" />
            <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        <g
          className="travel-map-viewport"
          transform={`matrix(${viewport.scale} 0 0 ${viewport.scale} ${viewport.x} ${viewport.y})`}
        >
          <path
            d={spherePath}
            fill="url(#travel-map-ocean)"
            stroke="var(--color-border)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={graticulePath}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="0.75"
            opacity="0.5"
            vectorEffect="non-scaling-stroke"
          />

          <g stroke="var(--color-border)" strokeWidth="0.85" strokeLinejoin="round">
            {countryPaths.map((country) => (
              <path
                key={country.key}
                d={country.path}
                fill={country.isVisited ? "var(--color-primary)" : "var(--color-card)"}
                fillOpacity={country.isVisited ? 0.16 : 0.94}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>

          {destinations.map((destination, index) => {
            const point = projectPoint(destination);
            if (!point) return null;
            const isActive = index === activeIndex;
            const tooltipLabel =
              destination.country === destination.label
                ? destination.country
                : `${destination.country} · ${destination.label}`;
            const tooltipWidth = Math.min(240, Math.max(86, tooltipLabel.length * 7.4 + 24));

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
                <g transform={`scale(${1 / viewport.scale})`}>
                  <circle r="22" fill="transparent" />
                  {isActive ? (
                    <circle
                      className="map-marker-pulse"
                      r="13"
                      fill="none"
                      stroke="var(--color-primary)"
                    />
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

                  <g className="map-marker-tooltip" aria-hidden="true">
                    <rect
                      x={-tooltipWidth / 2}
                      y="-62"
                      width={tooltipWidth}
                      height="30"
                      rx="9"
                      fill="var(--color-popover)"
                      stroke="var(--color-border)"
                      strokeWidth="1.25"
                    />
                    <path d="M -5 -32 L 0 -26 L 5 -32 Z" fill="var(--color-popover)" />
                    <text
                      x="0"
                      y="-42"
                      textAnchor="middle"
                      fill="var(--color-popover-foreground)"
                      fontFamily="var(--font-sans)"
                      fontSize="14"
                      fontWeight="600"
                    >
                      {tooltipLabel}
                    </text>
                  </g>
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      <div
        className="absolute left-2 top-2 z-30 flex items-center overflow-hidden rounded-lg border border-border bg-card/90 text-foreground shadow-sm backdrop-blur sm:left-4 sm:top-4"
        role="group"
        aria-label="Map zoom controls"
      >
        <button
          type="button"
          onClick={() => changeZoomLevel(-1)}
          disabled={!isZoomed}
          aria-label="Zoom out"
          title="Zoom out"
          className="motion-button flex size-8 items-center justify-center transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-35"
        >
          <Minus className="size-3.5" aria-hidden="true" />
        </button>
        <span
          className="min-w-11 border-l border-border px-1 text-center font-mono text-[0.58rem] text-muted-foreground"
          aria-label={`Current map zoom: ${Math.round(viewport.scale * 100)} percent`}
        >
          {Math.round(viewport.scale * 100)}%
        </span>
        <button
          type="button"
          onClick={() => changeZoomLevel(1)}
          disabled={viewport.scale >= maxMapZoom - 0.001}
          aria-label="Zoom in"
          title="Zoom in"
          className="motion-button flex size-8 items-center justify-center border-l border-border transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-35"
        >
          <Plus className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => animateViewportTo(initialViewport)}
          disabled={!isZoomed}
          aria-label="Reset map position and zoom"
          title="Reset map"
          className="motion-button flex size-8 items-center justify-center border-l border-border transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-35"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
        </button>
      </div>

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
        {isZoomed ? "Drag to pan" : "Scroll or pinch to zoom"}
      </p>
    </div>
  );
}
