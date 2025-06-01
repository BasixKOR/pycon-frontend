import { Box, Button, Stack, Tab, Tabs } from "@mui/material";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

type SupportedMapType = "kakao" | "google" | "naver";
const MAP_TYPES: SupportedMapType[] = ["kakao", "google", "naver"];

type LangType = "ko" | "en";

export type MapPropType = {
  language: LangType;
  geo: {
    lat: number;
    lng: number;
  };
  placeName: { [key in LangType]: string };
  placeCode: { [key in SupportedMapType]: string };
  googleMapIframeSrc: string;
};

type MapStateType = {
  tab: number;
};

export type MapDataType = {
  title: {
    ko: string;
    en: string;
  };
  color: {
    backgroundColor: React.CSSProperties["backgroundColor"];
    color: React.CSSProperties["color"];
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

export const Map: React.FC<MapPropType> = ({ language, geo, placeName, placeCode, googleMapIframeSrc }) => {
  const kakaoMapRef = React.useRef<HTMLDivElement>(null);
  const [mapState, setMapState] = React.useState<MapStateType>({ tab: 0 });
  const selectedMapType = MAP_TYPES[mapState.tab] || "kakao";
  const setTab = (_: React.SyntheticEvent, tab: number) => setMapState((ps) => ({ ...ps, tab }));

  React.useEffect(() => {
    const kakaoMapDiv = kakaoMapRef.current;
    if (!(window.kakao && window.kakao.maps && kakaoMapDiv)) return;

    const kakaoMapUrl = MapData.kakao.basePlaceInfoUrl + placeCode.kakao;
    const content: string = renderToStaticMarkup(
      <a
        href={kakaoMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ width: "max-content", height: "max-content" }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            textAlign: "center",
            fontSize: "18px",
            whiteSpace: "pre-wrap",
            textWrap: "nowrap",
          }}
        >
          {placeName[language]}
        </div>
      </a>
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
  }, [mapState.tab, geo, language, placeName, placeCode.kakao]);

  const mapStyle: React.CSSProperties = { border: 0, width: "100%", aspectRatio: "3/2" };

  return (
    <Box>
      <Tabs value={mapState.tab} onChange={setTab} variant="fullWidth">
        {Object.entries(MapData)
          .filter(([, v]) => !v.hideInTabs)
          .map(([k, d]) => (
            <Tab key={k} label={d.title[language]} sx={{ textTransform: "none" }} />
          ))}
      </Tabs>
      {selectedMapType === "kakao" && <div ref={kakaoMapRef} style={mapStyle} />}
      {selectedMapType === "google" && (
        <iframe
          title="map"
          src={googleMapIframeSrc}
          style={mapStyle}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
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
