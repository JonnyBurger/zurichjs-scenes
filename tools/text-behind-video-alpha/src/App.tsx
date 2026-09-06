import { useState, useRef, useEffect, useCallback } from "react";
import {
  Input,
  ALL_FORMATS,
  BlobSource,
  CanvasSink,
  CanvasSource,
  Output,
  BufferTarget,
  WebMOutputFormat,
  QUALITY_VERY_HIGH,
} from "mediabunny";
import {
  FileVideo,
  Type,
  Download,
  Play,
  Pause,
  Plus,
  Trash2,
  X,
  Layers,
} from "lucide-react";
import { pipeline } from "@huggingface/transformers";

interface TextElement {
  id: string;
  text: string;
  x: number; // absolute canvas pixels
  y: number; // absolute canvas pixels
  fontSize: number;
  color: string;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
}

interface VideoMeta {
  width: number;
  height: number;
  duration: number;
  fps: number;
}

interface LayerDownloads {
  foregroundUrl: string;
  backgroundUrl: string;
}

type DragState = {
  on: boolean;
  mode: "move" | "resize";
  id: string;
  ox: number;
  oy: number;
  startX: number;
  startY: number;
  startSize: number;
  didDrag: boolean;
};

const uid = () => Math.random().toString(36).slice(2, 9);

const FONTS = [
  // Display / Heavy
  "Bebas Neue",
  "Anton",
  "Bungee",
  "Archivo Black",
  "Black Ops One",
  "Alfa Slab One",
  "Titan One",
  "Rubik Mono One",
  "Ultra",
  "Monoton",
  // Bold Sans
  "Oswald",
  "Teko",
  "Fjalla One",
  "Barlow Condensed",
  "Rajdhani",
  "Russo One",
  "Orbitron",
  "Michroma",
  "Chakra Petch",
  "Exo 2",
  // Serif / Elegant
  "Playfair Display",
  "Cinzel",
  "Cormorant Garamond",
  "Lora",
  "DM Serif Display",
  // Script / Handwriting
  "Pacifico",
  "Permanent Marker",
  "Caveat",
  "Dancing Script",
  "Sacramento",
  "Satisfy",
  "Great Vibes",
  "Lobster",
  // Fun / Decorative
  "Righteous",
  "Bangers",
  "Luckiest Guy",
  "Fredoka",
  "Passion One",
  "Press Start 2P",
  "Silkscreen",
  // Clean / Modern
  "Montserrat",
  "Raleway",
  "Poppins",
  "Space Grotesk",
  "Sora",
  // System
  "Impact",
  "Arial",
];

const HANDLE_R = 8;
const PAD = 12;

function fontStr(el: TextElement): string {
  return `${el.italic ? "italic " : ""}${el.bold ? "bold " : ""}${el.fontSize}px "${el.fontFamily}", sans-serif`;
}

type Ctx2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

interface TextBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
  tw: number;
}

const getFitMeasureCtx = (() => {
  let ctx: CanvasRenderingContext2D | null = null;
  return () => {
    if (!ctx) {
      const canvas = document.createElement("canvas");
      ctx = canvas.getContext("2d")!;
    }
    return ctx;
  };
})();

function getFloorTimestamp(timestamps: number[], time: number): number | null {
  if (!timestamps.length) return null;
  if (time < timestamps[0]) return timestamps[0];

  let lo = 0;
  let hi = timestamps.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (timestamps[mid] <= time) lo = mid + 1;
    else hi = mid;
  }
  return timestamps[lo - 1] ?? null;
}

function measureTextBounds(ctx: Ctx2D, el: TextElement): TextBounds {
  ctx.font = fontStr(el);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const tw = ctx.measureText(el.text).width;
  return {
    tw,
    left: el.x - tw / 2 - PAD,
    top: el.y - el.fontSize * 0.65 - PAD / 2,
    right: el.x + tw / 2 + PAD,
    bottom: el.y + el.fontSize * 0.65 + PAD / 2,
  };
}

function drawTextLayer(
  ctx: Ctx2D,
  elements: TextElement[],
  selectedId?: string | null,
) {
  for (const el of elements) {
    ctx.font = fontStr(el);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.save();
    ctx.globalAlpha = el.opacity;
    if (el.strokeWidth > 0) {
      ctx.strokeStyle = el.strokeColor;
      ctx.lineWidth = el.strokeWidth * 2;
      ctx.lineJoin = "round";
      ctx.strokeText(el.text, el.x, el.y);
    }
    ctx.fillStyle = el.color;
    ctx.fillText(el.text, el.x, el.y);
    ctx.restore();

    if (el.id === selectedId) {
      const b = measureTextBounds(ctx, el);
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = "#818cf8";
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.strokeRect(b.left, b.top, b.right - b.left, b.bottom - b.top);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(b.right, b.bottom, HANDLE_R, 0, Math.PI * 2);
      ctx.fillStyle = "#818cf8";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }
  }
}

function computeFitFontSize(
  text: string,
  fontFamily: string,
  bold: boolean,
  canvasWidth: number,
): number {
  const ctx = getFitMeasureCtx();
  const target = canvasWidth * 0.85;
  let lo = 10,
    hi = 600;
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    ctx.font = `${bold ? "bold " : ""}${mid}px "${fontFamily}", sans-serif`;
    if (ctx.measureText(text).width <= target) lo = mid;
    else hi = mid;
  }
  return lo;
}

function computeAverageBrightness(canvas: HTMLCanvasElement): number {
  const ctx = canvas.getContext("2d")!;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let total = 0,
    count = 0;
  const step = Math.max(4, Math.floor(data.length / 40000));
  for (let i = 0; i < data.length; i += step * 4) {
    total += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    count++;
  }
  return total / count;
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function App() {
  const pipelineRef = useRef<any>(null);
  const [modelReady, setModelReady] = useState(false);
  const pendingRef = useRef<{ file: File; meta: VideoMeta } | null>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoObjectUrl, setVideoObjectUrl] = useState("");
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [curTime, setCurTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [procStatus, setProcStatus] = useState<"idle" | "running" | "done">(
    "idle",
  );
  const [procProgress, setProcProgress] = useState(0);
  const [procMsg, setProcMsg] = useState("");
  const fgRef = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const tsRef = useRef<number[]>([]);

  const [texts, setTexts] = useState<TextElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [textPanelOpen, setTextPanelOpen] = useState(false);
  const [smartColor, setSmartColor] = useState("#ffffff");

  const [renderStatus, setRenderStatus] = useState<"idle" | "running">("idle");
  const [renderProgress, setRenderProgress] = useState(0);
  const [layerDownloads, setLayerDownloads] =
    useState<LayerDownloads | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameCacheRef = useRef<HTMLCanvasElement | null>(null);
  const lastDrawnTimeRef = useRef(0);
  const dragRef = useRef<DragState>({
    on: false,
    mode: "move",
    id: "",
    ox: 0,
    oy: 0,
    startX: 0,
    startY: 0,
    startSize: 0,
    didDrag: false,
  });
  const rafRef = useRef<number>(0);

  const textsRef = useRef(texts);
  textsRef.current = texts;
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;

  useEffect(() => {
    if (pipelineRef.current) return;
    (async () => {
      try {
        pipelineRef.current = await pipeline(
          "background-removal",
          "onnx-community/BEN2-ONNX",
          { device: "webgpu" },
        );
      } catch (e) {
        console.error("Model load failed:", e);
        alert("Failed to load background removal model. See console for details.");
        return;
      }
      setModelReady(true);
    })();
  }, []);

  useEffect(() => {
    if (modelReady && pendingRef.current) {
      const { file, meta: m } = pendingRef.current;
      pendingRef.current = null;
      processFrames(file, m);
    }
  }, [modelReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = meta?.width ?? 1280;
    canvas.height = meta?.height ?? 720;
  }, [meta]);

  const findFgFrame = useCallback((t: number): HTMLCanvasElement | null => {
    const key = getFloorTimestamp(tsRef.current, t);
    return key == null ? null : (fgRef.current.get(key) ?? null);
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const vid = videoRef.current;
    if (!canvas || canvas.width === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width,
      h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    let drawnTime = lastDrawnTimeRef.current;
    if (vid && vid.readyState >= 2) {
      ctx.drawImage(vid, 0, 0, w, h);
      drawnTime = vid.currentTime;
      lastDrawnTimeRef.current = drawnTime;
      if (!frameCacheRef.current)
        frameCacheRef.current = document.createElement("canvas");
      const fc = frameCacheRef.current;
      if (fc.width !== w || fc.height !== h) {
        fc.width = w;
        fc.height = h;
      }
      fc.getContext("2d")!.drawImage(vid, 0, 0, w, h);
    } else if (frameCacheRef.current) {
      ctx.drawImage(frameCacheRef.current, 0, 0);
    } else {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, w, h);
    }

    drawTextLayer(ctx, textsRef.current, selectedIdRef.current);

    const fg = findFgFrame(drawnTime);
    if (fg) ctx.drawImage(fg, 0, 0, w, h);
  }, [findFgFrame]);

  useEffect(() => {
    const loop = () => {
      drawCanvas();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawCanvas]);

  function onVideoReady() {
    const vid = videoRef.current;
    if (!vid || !vid.videoWidth) return;
    const c = document.createElement("canvas");
    c.width = vid.videoWidth;
    c.height = vid.videoHeight;
    c.getContext("2d")!.drawImage(vid, 0, 0, c.width, c.height);
    const brightness = computeAverageBrightness(c);
    setSmartColor(brightness > 128 ? "#1a1a2e" : "#ffffff");
  }

  function onTimeUpdate() {
    const vid = videoRef.current;
    if (vid) setCurTime(vid.currentTime);
  }

  function togglePlay() {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      void vid.play();
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  }

  async function handleFile(file: File) {
    if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
    const url = URL.createObjectURL(file);

    setVideoObjectUrl(url);
    setVideoFile(file);
    setMeta(null);
    setCurTime(0);
    setIsPlaying(false);
    setProcStatus("idle");
    setProcProgress(0);
    setProcMsg("");
    fgRef.current.clear();
    tsRef.current = [];
    setRenderStatus("idle");
    setRenderProgress(0);
    if (layerDownloads) {
      URL.revokeObjectURL(layerDownloads.foregroundUrl);
      URL.revokeObjectURL(layerDownloads.backgroundUrl);
      setLayerDownloads(null);
    }
    frameCacheRef.current = null;
    setTexts([]);
    setSelectedId(null);

    try {
      const inp = new Input({
        formats: ALL_FORMATS,
        source: new BlobSource(file),
      });
      const vt = await inp.getPrimaryVideoTrack();
      if (!vt) {
        alert("No video track found");
        return;
      }

      const duration = await inp.computeDuration();
      const stats = await vt.computePacketStats(60);
      const newMeta: VideoMeta = {
        width: vt.displayWidth,
        height: vt.displayHeight,
        duration,
        fps: stats.averagePacketRate,
      };
      setMeta(newMeta);

      if (modelReady && pipelineRef.current) {
        processFrames(file, newMeta);
      } else {
        pendingRef.current = { file, meta: newMeta };
      }
    } catch (e) {
      console.error(e);
      alert("Could not read video: " + e);
    }
  }

  async function processFrames(fileArg?: File, metaArg?: VideoMeta) {
    const file = fileArg ?? videoFile;
    const m = metaArg ?? meta;
    if (!file || !m || !pipelineRef.current) return;

    setProcStatus("running");
    setProcProgress(0);
    fgRef.current.clear();
    tsRef.current = [];

    try {
      const inp = new Input({
        formats: ALL_FORMATS,
        source: new BlobSource(file),
      });
      const vt = await inp.getPrimaryVideoTrack();
      if (!vt) throw new Error("No video track");

      const sink = new CanvasSink(vt, {
        width: m.width,
        height: m.height,
        fit: "fill",
      });
      const estimatedTotal = Math.ceil(m.duration * m.fps);
      let count = 0;

      for await (const { canvas, timestamp } of sink.canvases()) {
        setProcMsg(`Removing background · frame ${count + 1}`);

        const result = await pipelineRef.current(canvas);
        const fgCanvas: HTMLCanvasElement = result.toCanvas();

        fgRef.current.set(timestamp, fgCanvas);
        tsRef.current.push(timestamp);
        count++;

        setProcProgress(Math.min((count / estimatedTotal) * 100, 99));
      }

      tsRef.current.sort((a, b) => a - b);
      setProcStatus("done");
      setProcProgress(100);
      setProcMsg(`${count} frames processed`);
    } catch (e) {
      console.error(e);
      setProcStatus("idle");
      setProcMsg("");
      alert("Processing error: " + e);
    }
  }

  async function renderVideo() {
    if (!videoFile || !meta || renderStatus === "running") return;
    setRenderStatus("running");
    setRenderProgress(0);

    try {
      const inp = new Input({
        formats: ALL_FORMATS,
        source: new BlobSource(videoFile),
      });
      const videoTrack = await inp.getPrimaryVideoTrack();
      if (!videoTrack) throw new Error("No video track");

      const foregroundOutput = new Output({
        format: new WebMOutputFormat(),
        target: new BufferTarget(),
      });
      const backgroundOutput = new Output({
        format: new WebMOutputFormat(),
        target: new BufferTarget(),
      });

      const fgMap = fgRef.current;
      const tsList = [...tsRef.current];
      const metaSnap = meta;

      function nearestFg(t: number): HTMLCanvasElement | null {
        const key = getFloorTimestamp(tsList, t);
        return key == null ? null : (fgMap.get(key) ?? null);
      }

      const foregroundCanvas = new OffscreenCanvas(
        metaSnap.width,
        metaSnap.height,
      );
      const backgroundCanvas = new OffscreenCanvas(
        metaSnap.width,
        metaSnap.height,
      );
      const foregroundCtx = foregroundCanvas.getContext("2d", {
        alpha: true,
      })!;
      const backgroundCtx = backgroundCanvas.getContext("2d", {
        alpha: true,
      })!;

      const encodingConfig = {
        codec: "vp9" as const,
        bitrate: QUALITY_VERY_HIGH,
        alpha: "keep" as const,
        keyFrameInterval: 1,
      };
      const foregroundSource = new CanvasSource(
        foregroundCanvas,
        encodingConfig,
      );
      const backgroundSource = new CanvasSource(
        backgroundCanvas,
        encodingConfig,
      );
      foregroundOutput.addVideoTrack(foregroundSource);
      backgroundOutput.addVideoTrack(backgroundSource);

      await Promise.all([foregroundOutput.start(), backgroundOutput.start()]);

      const sink = new CanvasSink(videoTrack, {
        width: metaSnap.width,
        height: metaSnap.height,
        fit: "fill",
      });
      const estimatedTotal = Math.ceil(metaSnap.duration * metaSnap.fps);
      let frameCount = 0;

      for await (const { canvas, timestamp, duration } of sink.canvases()) {
        const foreground = nearestFg(timestamp);
        if (!foreground) continue;

        foregroundCtx.clearRect(
          0,
          0,
          foregroundCanvas.width,
          foregroundCanvas.height,
        );
        foregroundCtx.drawImage(
          foreground,
          0,
          0,
          foregroundCanvas.width,
          foregroundCanvas.height,
        );

        backgroundCtx.globalCompositeOperation = "source-over";
        backgroundCtx.clearRect(
          0,
          0,
          backgroundCanvas.width,
          backgroundCanvas.height,
        );
        backgroundCtx.drawImage(
          canvas,
          0,
          0,
          backgroundCanvas.width,
          backgroundCanvas.height,
        );
        backgroundCtx.globalCompositeOperation = "destination-out";
        backgroundCtx.drawImage(
          foreground,
          0,
          0,
          backgroundCanvas.width,
          backgroundCanvas.height,
        );
        backgroundCtx.globalCompositeOperation = "source-over";

        await Promise.all([
          foregroundSource.add(timestamp, duration),
          backgroundSource.add(timestamp, duration),
        ]);

        frameCount++;
        setRenderProgress(
          Math.min(Math.round((frameCount / estimatedTotal) * 100), 99),
        );
      }

      await Promise.all([
        foregroundOutput.finalize(),
        backgroundOutput.finalize(),
      ]);

      if (layerDownloads) {
        URL.revokeObjectURL(layerDownloads.foregroundUrl);
        URL.revokeObjectURL(layerDownloads.backgroundUrl);
      }
      const foregroundBlob = new Blob(
        [foregroundOutput.target.buffer!],
        { type: "video/webm" },
      );
      const backgroundBlob = new Blob(
        [backgroundOutput.target.buffer!],
        { type: "video/webm" },
      );
      setLayerDownloads({
        foregroundUrl: URL.createObjectURL(foregroundBlob),
        backgroundUrl: URL.createObjectURL(backgroundBlob),
      });

      setRenderProgress(100);
      setRenderStatus("idle");
    } catch (e) {
      console.error(e);
      alert("Render error: " + e);
      setRenderStatus("idle");
    }
  }

  function getPointerPos(
    e: React.PointerEvent<HTMLCanvasElement>,
  ): [number, number] {
    const canvas = e.currentTarget;
    const r = canvas.getBoundingClientRect();
    const sx = canvas.width / r.width;
    const sy = canvas.height / r.height;
    return [(e.clientX - r.left) * sx, (e.clientY - r.top) * sy];
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (procStatus === "running" || renderStatus === "running") return;
    const [mx, my] = getPointerPos(e);
    const canvas = e.currentTarget;
    const ctx = canvas.getContext("2d")!;

    if (selectedId) {
      const selEl = texts.find((t) => t.id === selectedId);
      if (selEl) {
        const b = measureTextBounds(ctx, selEl);
        const dist = Math.sqrt((mx - b.right) ** 2 + (my - b.bottom) ** 2);
        if (dist <= HANDLE_R + 4) {
          canvas.setPointerCapture(e.pointerId);
          dragRef.current = {
            on: true,
            mode: "resize",
            id: selEl.id,
            ox: mx,
            oy: my,
            startX: selEl.x,
            startY: selEl.y,
            startSize: selEl.fontSize,
            didDrag: false,
          };
          return;
        }
      }
    }

    for (let i = texts.length - 1; i >= 0; i--) {
      const el = texts[i];
      const b = measureTextBounds(ctx, el);
      if (mx >= b.left && mx <= b.right && my >= b.top && my <= b.bottom) {
        canvas.setPointerCapture(e.pointerId);
        setSelectedId(el.id);
        dragRef.current = {
          on: true,
          mode: "move",
          id: el.id,
          ox: mx,
          oy: my,
          startX: el.x,
          startY: el.y,
          startSize: el.fontSize,
          didDrag: false,
        };
        return;
      }
    }

    setSelectedId(null);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const dr = dragRef.current;
    if (!dr.on) return;
    const [mx, my] = getPointerPos(e);

    if (!dr.didDrag) {
      const dist = Math.abs(mx - dr.ox) + Math.abs(my - dr.oy);
      if (dist < 4) return;
      dr.didDrag = true;
    }

    if (dr.mode === "move") {
      setTexts((prev) =>
        prev.map((t) =>
          t.id === dr.id
            ? { ...t, x: dr.startX + (mx - dr.ox), y: dr.startY + (my - dr.oy) }
            : t,
        ),
      );
    } else {
      const delta = (mx - dr.ox + my - dr.oy) / 2;
      const newSize = Math.max(
        10,
        Math.min(600, Math.round(dr.startSize + delta * 0.4)),
      );
      setTexts((prev) =>
        prev.map((t) => (t.id === dr.id ? { ...t, fontSize: newSize } : t)),
      );
    }
  }

  function onPointerUp() {
    const dr = dragRef.current;
    if (dr.on && !dr.didDrag && dr.id) {
      setTextPanelOpen(true);
    }
    dr.on = false;
  }

  function addText() {
    const w = canvasRef.current?.width ?? meta?.width ?? 1280;
    const h = canvasRef.current?.height ?? meta?.height ?? 720;
    const fitSize = computeFitFontSize("EDIT TEXT", "Archivo Black", false, w);
    const el: TextElement = {
      id: uid(),
      text: "EDIT TEXT",
      x: w / 2,
      y: h / 2,
      fontSize: fitSize,
      color: smartColor,
      fontFamily: "Archivo Black",
      bold: false,
      italic: false,
      strokeColor: "#000000",
      strokeWidth: 0,
      opacity: 1,
    };
    setTexts((prev) => [...prev, el]);
    setSelectedId(el.id);
    setTextPanelOpen(true);
  }

  function updateText(id: string, patch: Partial<TextElement>) {
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  const hasVideo = !!videoFile && !!meta;
  const isProcessing = procStatus === "running";
  const isExporting = renderStatus === "running";
  const canInteract = hasVideo && !isProcessing && !isExporting;
  const activeText = texts.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-white select-none overflow-hidden">
      <video
        ref={videoRef}
        src={videoObjectUrl || undefined}
        className="hidden"
        onLoadedData={onVideoReady}
        onTimeUpdate={onTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
      />

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ paddingBottom: hasVideo ? "136px" : "80px" }}
      >
        {!hasVideo && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 pointer-events-none z-10">
            <div className="absolute top-1/4 left-1/3 w-1/3 h-1/3 bg-violet-600/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/3 right-1/3 w-1/4 h-1/4 bg-fuchsia-600/8 rounded-full blur-[80px]" />

            <div className="relative z-10 flex flex-col items-center gap-4 text-center">
              <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/[0.06]">
                <Layers className="w-10 h-10 text-violet-400/50" />
              </div>
              <div>
                <p
                  className="text-2xl font-black tracking-tight text-white/20"
                  style={{ fontFamily: '"Archivo Black", sans-serif' }}
                >
                  Text Behind Video — Alpha Layers
                </p>
                <p className="mt-1.5 text-sm text-white/15">
                  Click{" "}
                  <span className="text-white/25 font-semibold">Video</span>{" "}
                  below to select a clip
                </p>
              </div>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full rounded-xl shadow-2xl ring-1 ring-white/[0.06]"
          style={{
            cursor: isProcessing ? "wait" : "default",
            opacity: hasVideo ? 1 : 0,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
      </div>

      {isProcessing && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 z-30"
          style={{ animation: "fade-in-down 0.3s ease-out" }}
        >
          <div className="glass-panel rounded-2xl px-5 py-3 flex flex-col gap-2 min-w-64">
            <p className="text-xs text-white/40 text-center">
              {procMsg || "Initialising…"}
            </p>
            <ProgressBar value={procProgress} />
            <p className="text-[10px] text-white/20 text-center">
              {procProgress.toFixed(0)}%
            </p>
          </div>
        </div>
      )}

      {hasVideo && meta && (
        <div className="absolute bottom-[88px] left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-30">
          <div className="glass-panel flex items-center gap-3 px-4 py-3 rounded-2xl">
            <button
              onClick={togglePlay}
              disabled={!canInteract}
              className="glass-btn w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current text-white/80" />
              ) : (
                <Play className="w-4 h-4 fill-current text-white/80" />
              )}
            </button>

            <span className="text-xs font-mono text-white/30 w-10 text-right flex-shrink-0">
              {String(Math.floor(curTime / 60)).padStart(2, "0")}:
              {String(Math.floor(curTime % 60)).padStart(2, "0")}
            </span>

            <input
              type="range"
              min={0}
              max={meta.duration}
              step={0.016}
              value={curTime}
              disabled={!canInteract}
              onChange={(e) => {
                const t = parseFloat(e.target.value);
                setCurTime(t);
                if (videoRef.current) videoRef.current.currentTime = t;
              }}
              className="flex-1 scrubber"
            />

            <span className="text-xs font-mono text-white/30 w-10 flex-shrink-0">
              {String(Math.floor(meta.duration / 60)).padStart(2, "0")}:
              {String(Math.floor(meta.duration % 60)).padStart(2, "0")}
            </span>
          </div>
        </div>
      )}

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40">
        <div className="glass-panel flex items-center gap-2 p-2 rounded-2xl">
          <label
            className="glass-btn w-14 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            title="Change video"
          >
            <FileVideo className="w-5 h-5 text-white/60" />
            <span className="text-[9px] text-white/30 font-medium tracking-wide">
              Video
            </span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </label>

          <div className="w-px h-7 bg-white/[0.08] mx-0.5" />

          <button
            onClick={() => {
              if (!canInteract) return;
              if (!textPanelOpen && texts.length === 0) addText();
              else setTextPanelOpen((p) => !p);
            }}
            disabled={!canInteract}
            title="Add / edit text"
            className={`glass-btn w-14 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 ${textPanelOpen ? "tool-active" : ""}`}
          >
            <Type
              className={`w-5 h-5 ${textPanelOpen ? "text-violet-400" : "text-white/60"}`}
            />
            <span
              className={`text-[9px] font-medium tracking-wide ${textPanelOpen ? "text-violet-400/70" : "text-white/30"}`}
            >
              Text
            </span>
          </button>

          <div className="w-px h-7 bg-white/[0.08] mx-0.5" />

          <button
            onClick={renderVideo}
            disabled={!canInteract}
            title={
              isExporting
                ? `Rendering ${renderProgress}%`
                : "Render transparent layers"
            }
            className="glass-btn relative w-14 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 overflow-hidden"
          >
            {isExporting && (
              <div
                className="absolute inset-0 bg-fuchsia-600/25 rounded-xl"
                style={{ width: `${renderProgress}%` }}
              />
            )}
            <Download
              className={`w-5 h-5 z-10 ${isExporting ? "text-fuchsia-400" : "text-white/60"}`}
            />
            <span
              className={`text-[9px] font-medium tracking-wide z-10 ${isExporting ? "text-fuchsia-400/70" : "text-white/30"}`}
            >
              {isExporting ? `${renderProgress}%` : "Render"}
            </span>
          </button>

          {layerDownloads && (
            <>
              <div className="w-px h-7 bg-white/[0.08] mx-0.5" />
              <a
                href={layerDownloads.foregroundUrl}
                download="text-behind-video-foreground.webm"
                className="glass-btn px-3 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5"
                title="Download the transparent foreground layer"
              >
                <Download className="w-5 h-5 text-amber-300" />
                <span className="text-[9px] font-medium tracking-wide text-amber-300/70">
                  Foreground
                </span>
              </a>
              <a
                href={layerDownloads.backgroundUrl}
                download="text-behind-video-background.webm"
                className="glass-btn px-3 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5"
                title="Download the transparent complementary background layer"
              >
                <Download className="w-5 h-5 text-sky-300" />
                <span className="text-[9px] font-medium tracking-wide text-sky-300/70">
                  Background
                </span>
              </a>
            </>
          )}
        </div>
      </div>

      <div
        className={`absolute top-4 right-4 z-30 w-80 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          textPanelOpen && hasVideo
            ? "translate-x-0 pointer-events-auto"
            : "translate-x-[110%] pointer-events-none"
        }`}
        style={{ bottom: hasVideo && meta ? "144px" : "80px" }}
      >
        <div className="h-full flex flex-col glass-panel rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.03]">
            <span className="text-sm font-semibold flex items-center gap-2 text-white/70">
              <Type className="w-4 h-4 text-violet-400" />
              Typography
            </span>
            <button
              onClick={() => setTextPanelOpen(false)}
              className="text-white/20 hover:text-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto panel-scroll px-4 py-3 space-y-4">
            {texts.length > 0 && (
              <div className="space-y-1">
                {texts.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                      t.id === selectedId
                        ? "bg-violet-500/20 ring-1 ring-violet-400/25"
                        : "bg-white/[0.03] hover:bg-white/[0.07]"
                    }`}
                  >
                    <span
                      className="flex-1 truncate text-xs font-semibold"
                      style={{
                        fontFamily: `"${t.fontFamily}", sans-serif`,
                        opacity: t.opacity,
                      }}
                    >
                      {t.text}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTexts((p) => p.filter((x) => x.id !== t.id));
                        if (selectedId === t.id) setSelectedId(null);
                      }}
                      className="text-white/15 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={addText}
              className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl
                bg-violet-500/15 hover:bg-violet-500/25 border border-violet-400/10
                text-violet-300 text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Text Layer
            </button>

            {activeText && (
              <>
                <div className="border-t border-white/[0.05] pt-1" />

                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/35 uppercase tracking-wider font-medium">
                    Content
                  </label>
                  <textarea
                    value={activeText.text}
                    onChange={(e) =>
                      updateText(activeText.id, { text: e.target.value })
                    }
                    className="w-full bg-black/30 border border-white/[0.08] rounded-xl px-3 py-2
                      text-sm text-white focus:outline-none focus:border-violet-400/50 resize-none h-14"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/35 uppercase tracking-wider font-medium">
                    Font
                  </label>
                  <div className="space-y-1 max-h-44 overflow-y-auto panel-scroll rounded-xl bg-white/[0.02] p-1 border border-white/[0.05]">
                    {FONTS.map((font) => (
                      <button
                        key={font}
                        onClick={() =>
                          updateText(activeText.id, { fontFamily: font })
                        }
                        className={`w-full text-left px-3 py-2 rounded-lg text-[15px] font-bold truncate transition-all ${
                          activeText.fontFamily === font
                            ? "bg-violet-500/20 ring-1 ring-violet-400/35 text-white"
                            : "text-white/50 hover:bg-white/[0.06] hover:text-white/80"
                        }`}
                        style={{ fontFamily: `"${font}", sans-serif` }}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-white/35 uppercase tracking-wider font-medium">
                      Size
                    </label>
                    <span className="text-[10px] text-white/25 font-mono">
                      {Math.round(activeText.fontSize)}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={600}
                    value={activeText.fontSize}
                    onChange={(e) =>
                      updateText(activeText.id, { fontSize: +e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-white/35 uppercase tracking-wider font-medium">
                      Opacity
                    </label>
                    <span className="text-[10px] text-white/25 font-mono">
                      {Math.round(activeText.opacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(activeText.opacity * 100)}
                    onChange={(e) =>
                      updateText(activeText.id, {
                        opacity: +e.target.value / 100,
                      })
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/35 uppercase tracking-wider font-medium">
                    Appearance
                  </label>
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/15 flex-shrink-0 shadow-inner">
                      <input
                        type="color"
                        value={activeText.color}
                        onChange={(e) =>
                          updateText(activeText.id, { color: e.target.value })
                        }
                        className="absolute inset-[-8px] w-[calc(100%+16px)] h-[calc(100%+16px)] cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-1 bg-white/[0.04] border border-white/[0.07] rounded-xl overflow-hidden h-10">
                      <button
                        onClick={() =>
                          updateText(activeText.id, { bold: !activeText.bold })
                        }
                        className={`flex-1 font-bold text-sm transition-colors ${
                          activeText.bold
                            ? "bg-white/15 text-white"
                            : "text-white/35 hover:bg-white/[0.08]"
                        }`}
                      >
                        B
                      </button>
                      <div className="w-px bg-white/[0.07]" />
                      <button
                        onClick={() =>
                          updateText(activeText.id, {
                            italic: !activeText.italic,
                          })
                        }
                        className={`flex-1 italic font-semibold text-sm transition-colors ${
                          activeText.italic
                            ? "bg-white/15 text-white"
                            : "text-white/35 hover:bg-white/[0.08]"
                        }`}
                      >
                        I
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setTexts((p) => p.filter((t) => t.id !== activeText.id));
                    setSelectedId(null);
                  }}
                  className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl
                    bg-red-500/8 hover:bg-red-500/18 border border-red-400/10
                    text-red-400 text-sm font-medium transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Layer
                </button>

                <p className="text-[9px] text-white/15 text-center leading-relaxed">
                  Drag to move · corner handle to resize
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
