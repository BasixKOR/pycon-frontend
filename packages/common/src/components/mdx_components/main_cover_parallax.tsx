import { Box } from "@mui/material";
import { CSSProperties, FC, useEffect, useRef } from "react";

export type ParallaxLayer = {
  src: string;
  depth: number; // 0 = 고정 배경, 값이 클수록 더 많이 움직임
  isBackground?: boolean; // 확대 없이 상단 페이드 마스크 적용
  isPixel?: boolean; // pixelated 렌더링
  alt?: string;
};

export type MainCoverParallaxProps = {
  layers: ParallaxLayer[];
  width?: number; // 원본 비율 계산용
  height?: number;
  maxWidth?: number;
};

const SCENE_MASK = "linear-gradient(to bottom, #000 0%, #000 94.5%, rgba(0, 0, 0, .55) 97.2%, transparent 100%)";
const BG_TOP_MASK = "linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, .24) 3%, #000 9%, #000 100%)";

export const MainCoverParallax: FC<MainCoverParallaxProps> = ({ layers, width = 1695, height = 928, maxWidth = 1695 }) => {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (scene === null) return;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return; // 모션 최소화 설정 존중

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frameId = 0;
    let running = false;

    const render = (): void => {
      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;
      scene.style.setProperty("--px", currentX.toFixed(4));
      scene.style.setProperty("--py", currentY.toFixed(4));
      if (Math.abs(targetX - currentX) < 0.0001 && Math.abs(targetY - currentY) < 0.0001) {
        running = false; // 목표값에 수렴하면 멈춰 유휴 연산을 아낌
        return;
      }
      frameId = requestAnimationFrame(render);
    };
    const ensureRunning = (): void => {
      if (running) return;
      running = true;
      frameId = requestAnimationFrame(render);
    };

    const setTarget = (clientX: number, clientY: number): void => {
      const rect = scene.getBoundingClientRect();
      targetX = ((clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onPointerMove = (event: PointerEvent): void => {
      setTarget(event.clientX, event.clientY);
      ensureRunning();
    };
    const onPointerLeave = (): void => {
      targetX = 0;
      targetY = 0;
      ensureRunning();
    };

    scene.addEventListener("pointermove", onPointerMove);
    scene.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(frameId);
      scene.removeEventListener("pointermove", onPointerMove);
      scene.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <Box
      ref={sceneRef}
      aria-label="PyCon Korea main cover parallax scene"
      sx={{
        position: "relative",
        display: "block",
        marginInline: "auto",
        width: `min(100%, ${maxWidth}px)`,
        aspectRatio: `${width} / ${height}`,
        overflow: "hidden",
        background: "transparent",
        isolation: "isolate",
        WebkitMaskImage: SCENE_MASK,
        maskImage: SCENE_MASK,
        "@media (max-width: 720px)": { width: "100vw" },
        "& img": {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          userSelect: "none",
          transformOrigin: "center",
          willChange: "transform",
          transform: "translate3d(calc(var(--px, 0) * var(--depth) * 18px), calc(var(--py, 0) * var(--depth) * 12px), 0) scale(var(--scale, 1.018))",
        },
      }}
    >
      {layers.map((layer, index) => {
        const style: CSSProperties & Record<`--${string}`, string | number> = { "--depth": layer.depth };
        if (layer.isBackground) {
          style["--scale"] = 1;
          style.WebkitMaskImage = BG_TOP_MASK;
          style.maskImage = BG_TOP_MASK;
        }
        if (layer.isPixel) {
          style.imageRendering = "pixelated";
          if (!layer.isBackground) style["--scale"] = 1.05;
        }
        return <img key={index} src={layer.src} alt={layer.alt ?? ""} style={style} />;
      })}
    </Box>
  );
};
