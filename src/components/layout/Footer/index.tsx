import styled from "@emotion/styled";

interface LinkItem {
  text: string;
  href: string;
}

interface FooterProps {
  slogan?: string;
  description?: string;
  links?: LinkItem[];
}

export default function Footer({
  slogan = "Weave with Python, 파이콘 한국 2025",
  description = "파이콘 한국 2025는 파이콘 한국 준비위원회가 만들고 있습니다\n파이썬 웹 프레임워크 Django로 만들었습니다",
  links = [
    { text: "파이콘 한국 행동 강령(CoC)", href: "#" },
    { text: "서비스 이용 약관", href: "#" },
    { text: "개인 정보 처리 방침", href: "#" },
  ],
}: FooterProps) {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSlogan>{slogan}</FooterSlogan>
        {description.split("\n").map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        <FooterLinks>
          {links.map((link, index) => (
            <>
              <Link key={link.text} href={link.href}>
                {link.text}
              </Link>
              {index < links.length - 1 && <Separator>|</Separator>}
            </>
          ))}
        </FooterLinks>
        <FooterIcons>
          <img
            src="src/assets/Footer/message.svg"
            alt="message"
            width={20}
            height={20}
          />
          <img
            src="src/assets/Footer/facebook.svg"
            alt="facebook"
            width={20}
            height={20}
          />
          <img
            src="src/assets/Footer/youtube.svg"
            alt="youtube"
            width={20}
            height={20}
          />
          <img src="src/assets/Footer/x.svg" alt="x" width={20} height={20} />

          <img
            src="src/assets/Footer/github.svg"
            alt="github"
            width={20}
            height={20}
          />
          <img
            src="src/assets/Footer/instagram.svg"
            alt="instagram"
            width={20}
            height={20}
          />
          <img
            src="src/assets/Footer/linkedin.svg"
            alt="linkedin"
            width={20}
            height={20}
          />
          <img
            src="src/assets/Footer/blog.svg"
            alt="blog"
            width={20}
            height={20}
          />
          <img
            src="src/assets/Footer/flickr.svg"
            alt="flickr"
            width={20}
            height={20}
          />
        </FooterIcons>
      </FooterContent>
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.common.white};
  font-size: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 267px;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const FooterSlogan = styled.div`
  font-weight: 600;
`;

const FooterLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;
const FooterIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;

const Link = styled.a`
  color: ${({ theme }) => theme.palette.common.white};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Separator = styled.span`
  color: ${({ theme }) => theme.palette.common.white};
  opacity: 0.5;
`;
