import styled from "@emotion/styled";
import * as Common from "@frontend/common";
import { Article, Email, Facebook, GitHub, Instagram, LinkedIn, OpenInNew, X, YouTube } from "@mui/icons-material";
import { Button } from "@mui/material";
import * as React from "react";

import FlickrIcon from "@apps/pyconkr/assets/thirdparty/flickr.svg?react";

interface LinkItem {
  text: string;
  href: string;
}

interface IconItem {
  icon: React.FC<{ width?: number; height?: number }>;
  alt: string;
  href: string;
}

interface FooterProps {
  slogan?: string;
  links?: LinkItem[];
  icons?: IconItem[];
}

const defaultIcons: IconItem[] = [
  {
    icon: Facebook,
    alt: "facebook",
    href: "https://www.facebook.com/pyconkorea/",
  },
  {
    icon: YouTube,
    alt: "YouTube",
    href: "https://www.youtube.com/c/PyConKRtube",
  },
  { icon: X, alt: "X", href: "https://x.com/PyConKR" },
  { icon: GitHub, alt: "github", href: "https://github.com/pythonkr" },
  {
    icon: Instagram,
    alt: "Instagram",
    href: "https://www.instagram.com/pycon_korea/",
  },
  {
    icon: LinkedIn,
    alt: "LinkedIn",
    href: "https://www.linkedin.com/company/pyconkorea/",
  },
  { icon: Article, alt: "blog", href: "https://blog.pycon.kr/" },
  {
    icon: FlickrIcon,
    alt: "Flickr",
    href: "https://www.flickr.com/photos/126829363@N08/",
  },
];

const Bar: React.FC = () => <div style={{ display: "inline-block", padding: "0 0.25rem" }}>|</div>;

export default function Footer({
  links = [
    {
      text: "파이콘 한국 행동 강령(CoC)",
      href: "https://pythonkr.github.io/pycon-code-of-conduct/ko/coc/a_intent_and_purpose.html",
    },
    { text: "서비스 이용 약관", href: "/about/terms-of-service" },
    { text: "개인 정보 처리 방침", href: "/about/privacy-policy" },
  ],
  icons = defaultIcons,
}: FooterProps) {
  const { sendEmail } = Common.Hooks.Common.useEmail();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterText>
          <strong>사단법인 파이썬사용자모임</strong>
          <br />
          서울특별시 강남구 강남대로84길 24-4
          <Bar />
          대표자명 : 배권한
          <Bar />
          대표 전화 번호 : 031-261-2203, 010-5298-6622, 010-8259-3013 (문자)
          <Bar />
          사업자 등록 번호 : 338-82-00046
          <a href="http://www.ftc.go.kr/bizCommPop.do?wrkr_no=3388200046" target="_blank" rel="noreferrer">
            <Button variant="outlined" startIcon={<OpenInNew sx={{ fontSize: "7pt" }} />}>
              사업자 정보 확인
            </Button>
          </a>
          <br />
          통신 판매 번호 : 2023-서울강남-03501
          <Bar />
          호스팅 제공자 : Amazon Web Services(Korea LLC)
          <Bar />
          문의: <a href="mailto:pyconkr@pycon.kr">pyconkr@pycon.kr</a>
        </FooterText>
        <FooterLinks>
          {links.map((link, index) => (
            <React.Fragment key={index}>
              <Link key={link.text} href={link.href}>
                {link.text}
              </Link>
              {index < links.length - 1 && <Separator>|</Separator>}
            </React.Fragment>
          ))}
        </FooterLinks>
        <FooterIcons>
          <IconLink onClick={sendEmail} aria-label="이메일 보내기">
            <Email width={20} height={20} aria-hidden="true" />
          </IconLink>
          {icons.map((icon) => (
            <IconLink
              key={icon.alt}
              href={icon.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${icon.alt}로 이동`}
            >
              <icon.icon width={20} height={20} aria-hidden="true" />
            </IconLink>
          ))}
        </FooterIcons>
        <FooterSlogan>© 2025, 파이콘 한국 준비위원회, All rights reserved.</FooterSlogan>
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
  max-height: 16rem;
  padding: 1rem 0;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const FooterText = styled.div`
  padding: 0 2rem;
  margin: 0.1rem;

  font-size: 9pt;

  a > button {
    margin-left: 0.25rem;
    padding: 0.05rem 0.25rem;
    font-size: 8pt;
    color: ${({ theme }) => theme.palette.common.white};
    border-color: ${({ theme }) => theme.palette.common.white};

    gap: 0.25rem;

    & span {
      margin-left: -2px;
      margin-right: 0;

      & svg {
        font-size: 12pt !important;
      }
    }
  }

  strong {
    font-size: 12pt;
  }
`;

const FooterSlogan = styled.div`
  text-align: center;
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

const IconLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  img {
    width: 20px;
    height: 20px;
  }
`;
