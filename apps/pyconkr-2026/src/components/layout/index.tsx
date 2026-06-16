import styled from "@emotion/styled";
import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

import { useAppContext } from "@apps/pyconkr-2026/contexts/app_context";

import Footer from "./Footer";
import Header from "./Header";
import { Sponsor } from "./Sponsor";

export default function MainLayout() {
  const { shouldShowSponsorBanner, language } = useAppContext();

  const DateInfo =
    language === "ko" ? (
      <div id="date">
        일자
        <table>
          <tbody>
            <tr>
              <th>2026.8.15 토 - 16 일</th>
              <td>컨퍼런스</td>
            </tr>
            <tr>
              <th>2026.8.17 월</th>
              <td>튜토리얼 / 스프린트 / 딥다이브</td>
            </tr>
          </tbody>
        </table>
      </div>
    ) : (
      <div id="date">
        DATE
        <table>
          <tbody>
            <tr>
              <th>2026.8.15 SAT - 16 SUN</th>
              <td>Conference</td>
            </tr>
            <tr>
              <th>2026.8.17 MON</th>
              <td>Tutorial / Sprint / Deep Dive</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  const VenueInfo =
    language === "ko" ? (
      <div id="venue">
        장소
        <h3>동국대학교, 서울</h3>
        <p>서울특별시 중구 필동로1길 30 동국대학교 신공학관</p>
      </div>
    ) : (
      <div id="venue">
        VENUE
        <h3>Dongguk University, Seoul</h3>
        <p>New Engineering Building, Dongguk University, 30, Pildong-ro 1-gil, Jung-gu, Seoul</p>
      </div>
    );

  return (
    <Stack sx={{ minHeight: "100dvh" }}>
      <Header />
      <MainContent>
        <Outlet />
        <img src="src/assets/pythonkorea_dongguk_logo.png" alt="Python Korea X Dongguk University Logo" style={{ width: "50%" }} />
        <DateVenueInfo>
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

const DateVenueInfo = styled.div`
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
      font-size: 0.75em;}
`;
