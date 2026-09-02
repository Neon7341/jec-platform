"use client";

import { useRef, useState } from "react";

interface Marker {
  id: number;
  x: number;
  y: number;
  type: string;
}

export default function StrategyPlannerPage() {
  const mapRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(1);

  const [markers, setMarkers] = useState<Marker[]>([]);

  const [selectedTool, setSelectedTool] =
    useState<string | null>(null);

  // =========================
  // SELECT TOOL
  // =========================

  const selectTool = (type: string) => {
    setSelectedTool(type);
  };

  // =========================
  // ADD MARKER BY CLICKING MAP
  // =========================

  const handleMapClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!selectedTool) return;

    if (!mapRef.current) return;

    const rect =
      mapRef.current.getBoundingClientRect();

    const x =
      ((e.clientX - rect.left) /
        rect.width) *
      100;

    const y =
      ((e.clientY - rect.top) /
        rect.height) *
      100;

    const newMarker: Marker = {
      id: Date.now(),
      x,
      y,
      type: selectedTool,
    };

    setMarkers((prev) => [
      ...prev,
      newMarker,
    ]);
  };

  // =========================
  // DRAG MARKER
  // =========================

  const handleMarkerDrag = (
    e: React.MouseEvent<HTMLButtonElement>,
    markerId: number
  ) => {
    e.stopPropagation();

    if (!mapRef.current) return;

    const rect =
      mapRef.current.getBoundingClientRect();

    const handleMouseMove = (
      moveEvent: MouseEvent
    ) => {
      let x =
        ((moveEvent.clientX - rect.left) /
          rect.width) *
        100;

      let y =
        ((moveEvent.clientY - rect.top) /
          rect.height) *
        100;

      // Keep marker inside map

      x = Math.max(
        0,
        Math.min(100, x)
      );

      y = Math.max(
        0,
        Math.min(100, y)
      );

      setMarkers((prev) =>
        prev.map((marker) =>
          marker.id === markerId
            ? {
                ...marker,
                x,
                y,
              }
            : marker
        )
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      document.removeEventListener(
        "mouseup",
        handleMouseUp
      );
    };

    document.addEventListener(
      "mousemove",
      handleMouseMove
    );

    document.addEventListener(
      "mouseup",
      handleMouseUp
    );
  };

  // =========================
  // REMOVE MARKER
  // =========================

  const removeMarker = (
    e: React.MouseEvent,
    id: number
  ) => {
    e.stopPropagation();

    setMarkers((prev) =>
      prev.filter(
        (marker) =>
          marker.id !== id
      )
    );
  };

  // =========================
  // CLEAR MARKERS
  // =========================

  const clearMarkers = () => {
    setMarkers([]);
  };

  // =========================
  // ZOOM
  // =========================

  const zoomIn = () => {
    setZoom((prev) =>
      Math.min(
        prev + 0.2,
        2.5
      )
    );
  };

  const zoomOut = () => {
    setZoom((prev) =>
      Math.max(
        prev - 0.2,
        0.6
      )
    );
  };

  // =========================
  // MARKER ICON
  // =========================

  const getMarkerIcon = (
    type: string
  ) => {
    switch (type) {
      case "drop":
        return "🪂";

      case "rotation":
        return "🔄";

      case "attack":
        return "⚔️";

      case "defend":
        return "🛡️";

      case "vehicle":
        return "🚗";

      default:
        return "📍";
    }
  };

  // =========================
  // TOOL NAME
  // =========================

  const getToolName = (
    type: string | null
  ) => {
    switch (type) {
      case "drop":
        return "Drop Location";

      case "rotation":
        return "Rotation";

      case "attack":
        return "Attack";

      case "defend":
        return "Defend";

      case "vehicle":
        return "Vehicle";

      default:
        return "Select a tool";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ================= HEADER ================= */}

      <div className="border-b border-purple-700 bg-zinc-950 px-6 py-4">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-purple-500">
              🗺️ Strategy Planner
            </h1>

            <p className="text-sm text-zinc-400 mt-1">
              BGMI Erangel Strategy Map
            </p>
          </div>

          <div className="flex items-center gap-2">

            <button
              onClick={zoomIn}
              className="w-10 h-10 rounded-lg bg-purple-600 hover:bg-purple-700 font-bold text-lg"
            >
              +
            </button>

            <div className="min-w-[70px] text-center bg-zinc-800 rounded-lg px-3 py-2 text-sm font-semibold">
              {Math.round(
                zoom * 100
              )}
              %
            </div>

            <button
              onClick={zoomOut}
              className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 font-bold text-lg"
            >
              −
            </button>

            <button
              onClick={clearMarkers}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-bold"
            >
              Clear
            </button>

          </div>

        </div>

      </div>

      {/* ================= MAIN ================= */}

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-90px)]">

        {/* ================= TOOLBAR ================= */}

        <aside className="w-full lg:w-64 shrink-0 bg-zinc-950 border-b lg:border-b-0 lg:border-r border-purple-700 p-5">

          <h2 className="text-lg font-bold text-purple-400 mb-5">
            Strategy Tools
          </h2>

          <div className="space-y-3">

            <button
              onClick={() =>
                selectTool("drop")
              }
              className={`w-full text-left p-3 rounded-xl transition ${
                selectedTool === "drop"
                  ? "bg-purple-600 border border-purple-400"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              🪂 Drop Location
            </button>

            <button
              onClick={() =>
                selectTool("rotation")
              }
              className={`w-full text-left p-3 rounded-xl transition ${
                selectedTool === "rotation"
                  ? "bg-purple-600 border border-purple-400"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              🔄 Rotation
            </button>

            <button
              onClick={() =>
                selectTool("attack")
              }
              className={`w-full text-left p-3 rounded-xl transition ${
                selectedTool === "attack"
                  ? "bg-purple-600 border border-purple-400"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              ⚔️ Attack
            </button>

            <button
              onClick={() =>
                selectTool("defend")
              }
              className={`w-full text-left p-3 rounded-xl transition ${
                selectedTool === "defend"
                  ? "bg-purple-600 border border-purple-400"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              🛡️ Defend
            </button>

            <button
              onClick={() =>
                selectTool("vehicle")
              }
              className={`w-full text-left p-3 rounded-xl transition ${
                selectedTool === "vehicle"
                  ? "bg-purple-600 border border-purple-400"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              🚗 Vehicle
            </button>

          </div>

          {/* SELECTED TOOL */}

          <div className="mt-6 bg-zinc-900 rounded-xl p-4 border border-purple-800">

            <p className="text-xs text-zinc-500">
              Selected Tool
            </p>

            <p className="font-bold text-purple-400 mt-1">
              {getToolName(
                selectedTool
              )}
            </p>

            {selectedTool && (
              <p className="text-xs text-zinc-500 mt-2">
                Click the map to place a marker.
              </p>
            )}

          </div>

          {/* MARKERS */}

          <div className="mt-6 border-t border-zinc-800 pt-5">

            <h3 className="font-bold text-zinc-300 mb-3">
              Markers
            </h3>

            <p className="text-sm text-zinc-500">
              {markers.length} marker
              {markers.length !== 1
                ? "s"
                : ""}
            </p>

          </div>

          {/* INSTRUCTIONS */}

          <div className="mt-6 bg-zinc-900 rounded-xl p-4 border border-zinc-800">

            <p className="text-sm font-semibold text-purple-400 mb-2">
              How to use
            </p>

            <p className="text-xs text-zinc-500 leading-5">
              1. Select a tool.
              <br />
              2. Click the map.
              <br />
              3. Drag a marker to move it.
              <br />
              4. Click a marker to remove it.
            </p>

          </div>

        </aside>

        {/* ================= MAP ================= */}

        <main className="flex-1 bg-black overflow-auto p-4 md:p-6">

          <div className="w-full flex justify-center">

            <div
              className="relative w-full max-w-[1200px] overflow-auto rounded-2xl border border-purple-700 shadow-2xl bg-zinc-950"
              style={{
                height:
                  "calc(100vh - 180px)",
                minHeight: "500px",
              }}
            >

              {/* MAP CANVAS */}

              <div
                ref={mapRef}
                onClick={handleMapClick}
                className={`relative ${
                  selectedTool
                    ? "cursor-crosshair"
                    : "cursor-default"
                }`}
                style={{
                  width: `${1000 * zoom}px`,
                  aspectRatio: "5 / 3",
                }}
              >

                {/* MAP IMAGE */}

                <img
                  src="/maps/erangel.png"
                  alt="BGMI Erangel Map"
                  className="absolute inset-0 w-full h-full object-fill select-none pointer-events-none"
                  draggable={false}
                />

                {/* MARKERS */}

                {markers.map(
                  (marker) => (

                    <button
                      key={marker.id}
                      onMouseDown={(e) =>
                        handleMarkerDrag(
                          e,
                          marker.id
                        )
                      }
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-grab active:cursor-grabbing"
                      style={{
                        left: `${marker.x}%`,
                        top: `${marker.y}%`,
                      }}
                      title="Drag to move marker"
                    >

                      <div
                        className="
                          w-10
                          h-10
                          rounded-full
                          bg-purple-600
                          border-2
                          border-white
                          flex
                          items-center
                          justify-center
                          text-lg
                          shadow-lg
                          transition
                          group-hover:scale-125
                        "
                      >
                        {getMarkerIcon(
                          marker.type
                        )}
                      </div>

                    </button>

                  )
                )}

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}