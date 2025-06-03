import styled from "@emotion/styled";
import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import Header from "./Header";
import Sponsor from "./Sponsor";

export default function MainLayout() {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        <Outlet />
      </MainContent>
      <Sponsor />
      <Footer />
    </LayoutContainer>
  );
}
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

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
