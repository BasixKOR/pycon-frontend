import { Article, Email, Facebook, GitHub, Instagram, LinkedIn, OpenInNew, X, YouTube } from "@mui/icons-material";
import { Box, Button, Stack, styled, Typography } from "@mui/material";
import * as React from "react";

import { useAppContext } from "../../../contexts/app_context";

interface IconItem {
  icon: React.FC<{ width?: number; height?: number }>;
  alt: string;
  href: string;
}

const socialIcons: IconItem[] = [
  { icon: Facebook, alt: "facebook", href: "https://www.facebook.com/pyconkorea/" },
  { icon: YouTube, alt: "YouTube", href: "https://www.youtube.com/c/PyConKRtube" },
  { icon: X, alt: "X", href: "https://x.com/PyConKR" },
  { icon: GitHub, alt: "github", href: "https://github.com/pythonkr" },
  { icon: Instagram, alt: "Instagram", href: "https://www.instagram.com/pycon_korea/" },
  { icon: LinkedIn, alt: "LinkedIn", href: "https://www.linkedin.com/company/pyconkorea/" },
  { icon: Article, alt: "blog", href: "https://blog.pycon.kr/" },
];

const Bar: React.FC = () => <span style={{ display: "inline-block", padding: "0 0.25rem", opacity: 0.4 }}>|</span>;

export default function Footer() {
  const { language } = useAppContext();

  const corpPasamoStr = language === "ko" ? "사단법인 파이썬사용자모임" : "Python Korea";
  const corpAddressStr =
    language === "ko" ? "서울특별시 강남구 강남대로84길 24-4" : "24-4, Gangnam-daero 84-gil, Gangnam-gu, Seoul, Republic of Korea";
  const corpRepresentatorStr = language === "ko" ? "대표자명 : 배권한" : "Representator : Kwon-Han Bae";
  const corpPhoneStr =
    language === "ko"
      ? "대표 전화 번호 : 031-261-2203, 010-5298-6622, 010-8259-3013 (문자)"
      : "Phone Number : 031-261-2203, 010-5298-6622, 010-8259-3013 (SMS)";
  const corpCompanyNumberStr = language === "ko" ? "사업자 등록 번호 : 338-82-00046" : "Business Registration Number : 338-82-00046";
  const corpCheckBtnStr = language === "ko" ? "사업자 정보 확인" : "Check Business Registration";
  const corpMailOrderStr =
    language === "ko" ? "통신 판매 번호 : 2023-서울강남-03501" : "Mail Order Sales Registration Number : 2023-SEOUL-GANGNAM-03501";
  const hostingStr =
    language === "ko" ? "호스팅 제공자 : Amazon Web Services(Korea LLC)" : "Hosting Provider : Amazon Web Services(Korea LLC)";
  const copyrightStr =
    language === "ko" ? "© 2026, 사단법인 파이썬사용자모임, All rights reserved." : "© 2026, Python Korea, All rights reserved.";

  const links = [
    {
      text: language === "ko" ? "파이콘 한국 행동 강령(CoC)" : "PyCon Korea Code of Conduct",
      href: "https://pythonkr.github.io/pycon-code-of-conduct/ko/coc/a_intent_and_purpose.html",
    },
    { text: language === "ko" ? "서비스 이용 약관" : "Terms of Service", href: "/about/terms-of-service" },
    { text: language === "ko" ? "개인 정보 처리 방침" : "Privacy Policy", href: "/about/privacy-policy" },
  ];

  return (
    <FooterContainer>
      <FooterContent>
        <FooterText>
          <strong>{corpPasamoStr}</strong>
          <br />
          {corpAddressStr}
          <Bar />
          {corpRepresentatorStr}
          <Bar />
          {corpPhoneStr}
          <Bar />
          {corpCompanyNumberStr}
          <a href="http://www.ftc.go.kr/bizCommPop.do?wrkr_no=3388200046" target="_blank" rel="noreferrer">
            <Button
              variant="outlined"
              size="small"
              startIcon={<OpenInNew sx={{ fontSize: "7pt !important" }} />}
              sx={{ ml: 0.5, py: "0.05rem", px: "0.25rem", fontSize: "8pt", color: "rgba(255,255,255,0.8)", borderColor: "rgba(255,255,255,0.4)" }}
            >
              {corpCheckBtnStr}
            </Button>
          </a>
          <br />
          {corpMailOrderStr}
          <Bar />
          {hostingStr}
          <Bar />
          {"문의: "}
          <a href="mailto:pyconkr@pycon.kr" style={{ color: "#f5c73d" }}>
            pyconkr@pycon.kr
          </a>
        </FooterText>

        <Box sx={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", justifyContent: "center", opacity: 0.8 }}>
          {links.map((link, index) => (
            <React.Fragment key={index}>
              <FooterLink href={link.href}>{link.text}</FooterLink>
              {index < links.length - 1 && <Bar />}
            </React.Fragment>
          ))}
        </Box>

        <Stack direction="row" spacing={1} justifyContent="center">
          <IconLink href="mailto:pyconkr@pycon.kr" aria-label="이메일 보내기">
            <Email sx={{ fontSize: 20 }} aria-hidden="true" />
          </IconLink>
          {socialIcons.map((item) => (
            <IconLink key={item.alt} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={`${item.alt}로 이동`}>
              <item.icon width={20} height={20} aria-hidden="true" />
            </IconLink>
          ))}
        </Stack>

        <Typography variant="caption" sx={{ opacity: 0.6, textAlign: "center" }}>
          {copyrightStr}
        </Typography>
      </FooterContent>
    </FooterContainer>
  );
}

const FooterContainer = styled("footer")({
  background: "linear-gradient(180deg, #12091e 0%, #2a0a40 45%, #ed5ebd 100%)",
  color: "#ffffff",
  fontSize: "0.75rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  padding: "2.5rem 0 1.5rem",
});

const FooterContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.875rem",
  maxWidth: "900px",
  padding: "0 2rem",
});

const FooterText = styled("div")({
  fontSize: "9pt",
  textAlign: "center",
  lineHeight: 1.8,
  opacity: 0.9,
  "& strong": { fontSize: "12pt" },
});

const FooterLink = styled("a")({
  color: "rgba(255, 255, 255, 0.85)",
  textDecoration: "none",
  fontSize: "8pt",
  "&:hover": { textDecoration: "underline" },
});

const IconLink = styled("a")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(255, 255, 255, 0.8)",
  cursor: "pointer",
  "&:hover": { color: "#ffffff", opacity: 0.9 },
});
