import styled from "@emotion/styled";

export default function Header() {
  return (
    <HeaderContainer>
      <HeaderLogo>
        <img
          src="src/assets/pyconLogo.png"
          width={40}
          height={40}
          alt="pyconLogo"
        />
      </HeaderLogo>

      <nav>
        <HeaderNav>
          <li>파이콘 한국</li>
          <li>프로그램</li>
          <li>세션</li>
          <li>구매</li>
          <li>재정 지원</li>
          <li>후원하기</li>
        </HeaderNav>
      </nav>
      <HeaderLeft>
        <HeaderItem>
          <img
            src="src/assets/langIcon.png"
            width={25}
            height={25}
            alt="langIcon"
          />
          <span>KO</span>
          <span>EN</span>
        </HeaderItem>
        <div>로그인</div>
      </HeaderLeft>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.palette.primary.light};
  font-color: ${({ theme }) => theme.palette.primary.dark};
  font-size: 0.8125rem;
  font-weight: 500;
  width: 100%;
  height: 3.625rem;
  padding: 0.5625rem 7.125rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderNav = styled.ul`
  display: flex;
  align-items: center;
  gap: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.125rem;
`;

const HeaderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;
