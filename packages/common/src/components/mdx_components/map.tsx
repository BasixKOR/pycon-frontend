import { Box, Button, CircularProgress, Stack, Tab, Tabs, Typography } from "@mui/material";
import { CSSProperties, FC, SyntheticEvent, useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { useCommonContext } from "@frontend/common/hooks/useCommonContext";

type SupportedMapType = "kakao" | "google" | "naver";
const MAP_TYPES: SupportedMapType[] = ["kakao", "google", "naver"];

type LangType = "ko" | "en";

export type MapPropType = {
  /** 지도 중심 좌표. `lat`=위도, `lng`=경도. */
  geo: {
    lat: number;
    lng: number;
  };
  /** 장소 이름. 언어별(`ko`/`en`)로 지정하며 카카오맵 마커 안내에 표시된다. */
  placeName: { [key in LangType]: string };
  /** 각 지도 서비스의 장소 코드. `kakao`/`google`/`naver` 별 '열기' 링크를 만드는 데 사용한다. */
  placeCode: { [key in SupportedMapType]: string };
  /** 구글 지도 탭에 임베드할 iframe 의 src URL. */
  googleMapIframeSrc: string;
};

type MapStateType = {
  tab: number;
};

/**
 * dapi.kakao.com 의 sdk.js 는 첫 줄에서 `window.kakao.maps` 를 빈 객체로 만들어 두고,
 * 실제 클래스(LatLng·Map 등)는 뒤이어 주입되는 kakao.js 가 붙여준다.
 * 게다가 autoload 모드에서는 로드 완료와 무관하게 readyState 를 즉시 2 로 올려서 `kakao.maps.load()` 콜백도 바로 실행된다.
 * 따라서 `window.kakao.maps` 존재 여부로는 판단할 수 없고, 실제로 쓸 생성자가 붙었는지를 확인해야 한다.
 * (느린 네트워크에서 브라우저가 document.write 로 삽입된 스크립트를 차단하면 끝내 붙지 않는다.)
 */
const isKakaoMapsReady = (): boolean => typeof window.kakao?.maps?.LatLng === "function" && typeof window.kakao?.maps?.Map === "function";

/**
 * `autoload=false` 로 심은 경우 이 호출이 실제 로딩을 시작시킨다(document.write 가 아닌 동적 스크립트 삽입).
 * autoload 모드에서는 콜백만 즉시 실행되고 끝나므로 무해하다. sdk.js 자체가 아직 없으면 false 를 돌려준다.
 */
const requestKakaoMapsLoad = (): boolean => {
  if (typeof window.kakao?.maps?.load !== "function") return false;
  window.kakao.maps.load(() => undefined);
  return true;
};

const KAKAO_MAPS_POLL_INTERVAL_MS = 200;
const KAKAO_MAPS_TIMEOUT_MS = 5000;

type KakaoMapsStatus = "loading" | "ready" | "failed";

const useKakaoMapsStatus = (): KakaoMapsStatus => {
  const [status, setStatus] = useState<KakaoMapsStatus>(() => (isKakaoMapsReady() ? "ready" : "loading"));

  useEffect(() => {
    if (status !== "loading") return;

    let loadRequested = requestKakaoMapsLoad();
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      if (!loadRequested) loadRequested = requestKakaoMapsLoad();

      if (isKakaoMapsReady()) setStatus("ready");
      else if (Date.now() - startedAt >= KAKAO_MAPS_TIMEOUT_MS) setStatus("failed");
    }, KAKAO_MAPS_POLL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [status]);

  return status;
};

export type MapDataType = {
  title: {
    ko: string;
    en: string;
  };
  color: {
    backgroundColor: CSSProperties["backgroundColor"];
    color: CSSProperties["color"];
  };
  basePlaceInfoUrl: string;
  hideInTabs?: boolean;
};

const MapData: { [key in SupportedMapType]: MapDataType } = {
  kakao: {
    title: { ko: "카카오맵", en: "Kakaomap" },
    color: { backgroundColor: "#fee500", color: "#191919" },
    basePlaceInfoUrl: "https://map.kakao.com/link/map/",
  },
  naver: {
    title: { ko: "네이버 지도", en: "NAVER Map" },
    color: { backgroundColor: "#04c75b", color: "#fff" },
    basePlaceInfoUrl: "https://naver.me/",
    hideInTabs: true,
  },
  google: {
    title: { ko: "구글 지도", en: "Google Maps" },
    color: { backgroundColor: "#4285f4", color: "#fff" },
    basePlaceInfoUrl: "https://maps.app.goo.gl/",
  },
};

const KakaoMapArea: FC<{
  status: KakaoMapsStatus;
  mapRef: React.RefObject<HTMLDivElement | null>;
  style: CSSProperties;
  language: LangType;
}> = ({ status, mapRef, style, language }) => {
  if (status === "ready") return <div ref={mapRef} style={style} />;

  return (
    <Stack sx={{ ...style, alignItems: "center", justifyContent: "center", backgroundColor: "action.hover" }}>
      {status === "loading" ? (
        <CircularProgress size="1.5rem" />
      ) : (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ p: 2 }}>
          {language === "ko" ? "카카오맵을 불러오지 못했어요. 아래 버튼으로 열어주세요." : "Couldn't load Kakao Map. Please use the button below."}
        </Typography>
      )}
    </Stack>
  );
};

/**
 * 카카오맵·구글지도·네이버지도 탭으로 특정 장소를 보여주는 지도 컴포넌트.
 * 각 지도 서비스로 바로 여는 버튼도 함께 렌더하며, 주로 행사장 위치 안내에 사용한다.
 * @example <Common__Components__MDX__Map geo={{ lat: 37.5665, lng: 126.978 }} placeName={{ ko: "서울시청", en: "Seoul City Hall" }} placeCode={{ kakao: "7942135", google: "ChIJ...", naver: "..." }} googleMapIframeSrc="https://www.google.com/maps/embed?pb=..." />
 */
export const Map: FC<MapPropType> = ({ geo, placeName, placeCode, googleMapIframeSrc }) => {
  const { language } = useCommonContext();
  const kakaoMapRef = useRef<HTMLDivElement>(null);
  const kakaoMapsStatus = useKakaoMapsStatus();
  const [mapState, setMapState] = useState<MapStateType>({ tab: 0 });
  const selectedMapType = MAP_TYPES[mapState.tab] || "kakao";
  const setTab = (_: SyntheticEvent, tab: number) => setMapState((ps) => ({ ...ps, tab }));

  useEffect(() => {
    const kakaoMapDiv = kakaoMapRef.current;
    if (kakaoMapsStatus !== "ready" || !kakaoMapDiv) return;

    const kakaoMapUrl = MapData.kakao.basePlaceInfoUrl + placeCode.kakao;
    const content: string = renderToStaticMarkup(
      <a
        href={kakaoMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          boxSizing: "border-box",
          width: "max-content",
          maxWidth: "240px",
          padding: "8px 12px",
          textAlign: "center",
          fontSize: "20px",
          lineHeight: 1.4,
          whiteSpace: "normal",
          wordBreak: "keep-all",
          color: "#000",
          textDecoration: "none",
        }}
        children={placeName[language]}
      />
    );
    const position = new window.kakao.maps.LatLng(geo.lat, geo.lng);
    const map = new window.kakao.maps.Map(kakaoMapDiv, { center: position, level: 3 });
    const infoWindow = new kakao.maps.InfoWindow({ content });
    infoWindow.open(map, new kakao.maps.Marker({ map, position }));

    return () => {
      if (infoWindow) infoWindow.close();
      if (map) map.setCenter(new kakao.maps.LatLng(geo.lat, geo.lng));
      if (kakaoMapDiv) kakaoMapDiv.innerHTML = ""; // Clear the map container
    };
  }, [mapState.tab, geo, language, placeName, placeCode.kakao, kakaoMapsStatus]);

  const mapStyle: CSSProperties = { border: 0, width: "100%", aspectRatio: "3/2" };

  return (
    <Box>
      <Tabs value={mapState.tab} onChange={setTab} variant="fullWidth">
        {Object.entries(MapData)
          .filter(([, v]) => !v.hideInTabs)
          .map(([k, d]) => (
            <Tab key={k} label={d.title[language]} sx={{ textTransform: "none" }} />
          ))}
      </Tabs>
      {selectedMapType === "kakao" && <KakaoMapArea status={kakaoMapsStatus} mapRef={kakaoMapRef} style={mapStyle} language={language} />}
      {selectedMapType === "google" && (
        <iframe title="map" src={googleMapIframeSrc} style={mapStyle} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      )}
      <Stack>
        {Object.entries(MapData).map(([key, data]) => {
          return (
            <Button
              key={key}
              sx={{
                backgroundColor: data.color.backgroundColor,
                color: data.color.color,
                textTransform: "none",
              }}
              href={`${data.basePlaceInfoUrl}${placeCode[key as SupportedMapType]}`}
              target="_blank"
            >
              {language === "ko" ? `${data.title.ko}에서 열기` : `Open in ${data.title.en}`}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
};
