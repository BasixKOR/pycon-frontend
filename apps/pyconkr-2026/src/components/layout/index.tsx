import styled from "@emotion/styled";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

import { useAppContext } from "@apps/pyconkr-2026/contexts/app_context";

import Footer from "./Footer";
import Header from "./Header";
import { Sponsor } from "./Sponsor";

import DonggukLogo from "@apps/pyconkr-2026/assets/pythonkorea_dongguk_logo.png";

export default function MainLayout() {
  const { shouldShowSponsorBanner, language } = useAppContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const dates: { [key in "conference" | "etc"]: { [key in ReturnType<typeof useAppContext>["language"]]: { date: string; description: string } } } = {
    conference: {
      ko: { date: "2026.8.15 토 - 16 일", description: "컨퍼런스" },
      en: { date: "2026.8.15 SAT - 16 SUN", description: "Conference" },
    },
    etc: {
      ko: { date: "2026.8.17 월", description: "튜토리얼 / 스프린트 / 딥다이브" },
      en: { date: "2026.8.17 MON", description: "Tutorial / Sprint / Deep Dive" },
    },
  };

  const DateInfo = (
    <div id="date">
      {isMobile ? (
        <>
          <div>{dates.conference[language].date}</div>
          <div>{dates.conference[language].description}</div>
          <div>{dates.etc[language].date}</div>
          <div>{dates.etc[language].description}</div>
        </>
      ) : (
        <>
          {language === "ko" ? "일자" : "DATE"}
          <table>
            <tbody>
              <tr>
                <th>{dates.conference[language].date}</th>
                <td>{dates.conference[language].description}</td>
              </tr>
              <tr>
                <th>{dates.etc[language].date}</th>
                <td>{dates.etc[language].description}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );

  const venues: { [key in ReturnType<typeof useAppContext>["language"]]: { title: string; name: string; address: string } } = {
    ko: { title: "장소", name: "동국대학교, 서울", address: "서울특별시 중구 필동로1길 30 동국대학교 신공학관" },
    en: {
      title: "VENUE",
      name: "Dongguk University, Seoul",
      address: "New Engineering Building, Dongguk University, 30, Pildong-ro 1-gil, Jung-gu, Seoul",
    },
  };

  const VenueInfo = (
    <div id="venue">
      {!isMobile && venues[language].title}
      <h3>{venues[language].name}</h3>
      <p>{venues[language].address}</p>
    </div>
  );

  return (
    <Stack sx={{ minHeight: "100dvh" }}>
      <Header />
      <MainContent>
        <Outlet />
        <img src={DonggukLogo} alt="Python Korea X Dongguk University Logo" style={{ width: isMobile ? "95%" : "50%" }} />
        <DateVenueInfo isMobile={isMobile}>
          {DateInfo}
          {VenueInfo}
        </DateVenueInfo>
      </MainContent>
      {shouldShowSponsorBanner && <Sponsor />}
      <Footer />
    </Stack>
  );
}

const MainContent = styled.main`
  flex: 1;

  width: 100%;
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > * {
    flex-grow: 1;
  }
`;

const DateVenueInfo = styled.div<{ isMobile: boolean }>`
  display: flex;
  justify-content: center;
  font-size: 1.25rem;
  margin-top: 2rem;

  & > div#date {
    margin-right: 2em;

    & > table {
      margin-top: 1em;
    }

    & > table th {
      text-align: left;
      padding-right: 2rem;
    }
  }

  & > div#venue {
    & > h3 {
      margin-top: 1em;
      margin-bottom: 0.3em;
    }

    & > p {
      margin: 0;
      font-size: 0.75em;
    }
  }

  ${(props) =>
    props.isMobile &&
    `
    display: block;
    font-size: 0.9rem;
    margin-top: 1rem;
    width: 80%;

    & > div#date {
      margin-bottom: 2rem;

      & > div:nth-of-type(odd) {
        font-weight: bold;
      }
        & > div:nth-of-type(3) {
          margin-top: 1rem;
        }
    }
    `}
`;
