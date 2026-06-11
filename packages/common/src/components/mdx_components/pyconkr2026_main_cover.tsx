import { FC, createElement } from "react";

import { MainCoverParallax, type ParallaxLayer } from "./main_cover_parallax";

const PyConKR2026CoverLayerUrlByName: Record<string, string> = Object.fromEntries(
  Object.entries(import.meta.glob<string>("../../assets/main_cover_layers/*.webp", { eager: true, query: "?url", import: "default" })).map(
    ([path, url]) => [path.split("/").pop() as string, url]
  )
);

// 뒤(배경) -> 앞(전경) 순서, depth가 클수록 더 크게 반응.
export const PyConKR2026CoverLayers: ParallaxLayer[] = (
  [
    { name: "00_background.webp", depth: 0.0, isBackground: true },
    { name: "00_background_top_color_fade.webp", depth: 0.0, isBackground: true },
    { name: "00_back_hill_skyline_pixel_imagegen.webp", depth: 0.035, isPixel: true },
    { name: "09_mid_right_skyline_wide_left_up_offset.webp", depth: 0.07 },
    { name: "01_tower_hill_city_filled_top_aligned.webp", depth: 0.08 },
    { name: "01_hill_foreground_bottom_fill_imagegen.webp", depth: 0.11, isPixel: true },
    { name: "01_hill_foreground_gap_fill_up100.webp", depth: 0.11, isPixel: true },
    { name: "01_hill_foreground_marked_gap_patch.webp", depth: 0.11, isPixel: true },
    { name: "05_roller_coaster_code_large_half_lower.webp", depth: 0.15 },
    { name: "03_ferris_wheel_aligned.webp", depth: 0.17 },
    { name: "06_castle_aligned.webp", depth: 0.2 },
    { name: "08_foreground_environment_with_entrance_floor.webp", depth: 0.24 },
    { name: "08_foreground_bottom_fade_imagegen.webp", depth: 0.24, isPixel: true },
    { name: "02_entrance_ticket_no_floor_aligned.webp", depth: 0.26 },
    { name: "04_program_signboard_front.webp", depth: 0.28 },
    { name: "07_carousel_larger_lower.webp", depth: 0.32 },
    { name: "00_logo_manual_mask.webp", depth: 0.18, noBlur: true },
  ] as const
).map(({ name, ...rest }) => ({ src: PyConKR2026CoverLayerUrlByName[name], ...rest }));

export const PyConKR2026MainCover: FC<object> = () => createElement(MainCoverParallax, { layers: PyConKR2026CoverLayers });
