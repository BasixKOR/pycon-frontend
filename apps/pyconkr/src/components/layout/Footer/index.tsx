import styled from "@emotion/styled";
import * as Common from "@frontend/common";
import { Article, Email, Facebook, GitHub, Instagram, LinkedIn, X, YouTube } from "@mui/icons-material";
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
  description?: string;
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

export default function Footer({
  slogan = "Weave with Python, 파이콘 한국 2025",
  description = "파이콘 한국 2025는 파이콘 한국 준비위원회가 만들고 있습니다\n파이썬 웹 프레임워크 Django로 만들었습니다",
  links = [
    { text: "파이콘 한국 행동 강령(CoC)", href: "#" },
    { text: "서비스 이용 약관", href: "#" },
    { text: "개인 정보 처리 방침", href: "#" },
  ],
  icons = defaultIcons,
}: FooterProps) {
  const { sendEmail } = Common.Hooks.Common.useEmail();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSlogan>{slogan}</FooterSlogan>
        {description.split("\n").map((line, index) => (
          <div key={index}>{line}</div>
        ))}
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
