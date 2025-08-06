import styled from "@emotion/styled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionDetails, AccordionSummary, Accordion as MuiAccordion, Stack, Typography } from "@mui/material";
import * as React from "react";
import Marquee from "react-fast-marquee";
import { useAppContext } from "../../../../../apps/pyconkr/src/contexts/app_context";
import PyCon2025HostLogoBig from "../../assets/pyconkr2025_hostlogo_big.png";
import PyCon2025HostLogoSmall from "../../assets/pyconkr2025_hostlogo_small.png";

const MarqueeAccordion: React.FC = () => {
  const [marqueeKey, setMarqueeKey] = React.useState<number>(0);

  const items = React.useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => {
      return (
        <Stack direction={"row"} sx={{ gap: 0 }}>
          <StyledTypography>{"AUG 15 - 17"}</StyledTypography>
          <img src={PyCon2025HostLogoSmall} />
        </Stack>
      );
    });
  }, []);

  const onMarqueeCycleComplete = () => {
    if (marqueeKey === 0) {
      setMarqueeKey(1);
    } else {
      setMarqueeKey(0);
    }
  };

  return (
    <Marquee key={marqueeKey} onCycleComplete={onMarqueeCycleComplete} loop={0} speed={30} style={{ width: "100%", margin: 0, padding: 0 }}>
      {items}
    </Marquee>
  );
};

export const MobilePageAccordion: React.FC = () => {
  const { language } = useAppContext();
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const venue = language === "ko" ? "서울특별시 중구 필동로 1길 30 동국대학교 신공학관" : "New Engineering Building, Dongguk University";

  const a = "Pildong-ro 1-gil, Jung-gu, Seoul, Republic of Korea";

  return (
    <AccordionWrapper>
      <StyledAccordion expanded={expanded} onChange={() => setExpanded((prev) => !prev)}>
        {!expanded && (
          <AccordionSummary
            sx={{}}
            expandIcon={
              <ExpandMoreIcon
                sx={{
                  position: "absolute",
                  right: 0,
                  transform: "translateY(-50%)",
                }}
              />
            }
          >
            {expanded ? null : <MarqueeAccordion />}
          </AccordionSummary>
        )}
        <StyledAccordionDetails>
          {expanded ? (
            <Stack sx={{ objectFit: "contain", margin: 0, padding: 0 }}>
              <img src={PyCon2025HostLogoBig} alt="PyCon 2025 Host Logo" style={{ objectFit: "contain" }} />
              {language === "ko" ? (
                <Stack direction="column" sx={{ transform: "translateY(-150%)" }}>
                  <Typography color="#938A85" textAlign="center" fontSize="12px" fontWeight={400}>
                    {"서울특별시 중구 필동로 1길 30 동국대학교 신공학관"}
                  </Typography>
                </Stack>
              ) : (
                <Stack direction="column" sx={{ transform: "translateY(-80%)" }}>
                  <Typography color="#938A85" textAlign="center" fontSize="12px" fontWeight={400}>
                    {"New Engineering Building, Dongguk University"}
                  </Typography>
                  <Typography color="#938A85" textAlign="center" fontWeight={400} fontSize="12px">
                    {"Pildong-ro 1-gil, Jung-gu, Seoul, Republic of Korea"}
                  </Typography>
                </Stack>
              )}
            </Stack>
          ) : null}
        </StyledAccordionDetails>
      </StyledAccordion>
    </AccordionWrapper>
  );
};

const AccordionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
`;

const StyledAccordion = styled(MuiAccordion)`
  box-shadow: none;
  border-radius: 0;

  &:before {
    display: none;
  }

  &.MuiAccordion-root {
    margin: 0;

    &:first-of-type {
      border-top: none;
    }

    &:last-of-type {
      border-bottom: none;
    }
  }

  .MuiAccordionSummary-root {
    padding: 10px 35px;
    min-height: 60px;
    max-height: 60px;

    .MuiAccordionSummary-content {
      display: flex;
      align-items: center;
      margin: 0;
    }

    &.Mui-expanded {
      min-height: 60px;
      max-height: 60px;
      object-fit: contain;
    }
  }

  '& .MuiAccordionSummary-expandIconWrapper': {
      position: 'absolute',
      left: 8,
      top: '50%',
      transform: 'translateY(-50%)'
    },

  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
`;

const StyledTypography = styled(Typography)`
  font-weight: 600;
  font-size: 1rem;
  color: #938a85;
  text-align: center;
  padding: 0 10px;
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  border-radius: 16px;
  font-size: 14px;
  font-weight: 400;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 20;
`;
