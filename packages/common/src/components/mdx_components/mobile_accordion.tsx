import styled from "@emotion/styled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionDetails, AccordionSummary, Accordion as MuiAccordion, Stack, Typography } from "@mui/material";
import * as React from "react";
import PyCon2025HostLogoBig from "../../assets/pyconkr2025_hostlogo_big.png";
import PyCon2025HostLogoSmall from "../../assets/pyconkr2025_hostlogo_small.png";

const AccordionExpandedStyle: React.CSSProperties = {
  backgroundColor: "white",
  overflow: "hidden",
};

export const MobilePageAccordion: React.FC = () => {
  const [expanded, setExpanded] = React.useState<boolean>(false);

  return (
    <AccordionWrapper>
      <StyledAccordion expanded={expanded} onChange={() => setExpanded((prev) => !prev)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {expanded ? null : (
            <Stack direction={"row"} sx={{ gap: "1rem" }}>
              <Typography>{"AUG 15 - 17"}</Typography>
              <img src={PyCon2025HostLogoSmall} />
            </Stack>
          )}
        </AccordionSummary>
        <StyledAccordionDetails>
          {expanded ? (
            <Stack alignItems="center" justifyContent="center" sx={{ ...AccordionExpandedStyle }}>
              <img
                src={PyCon2025HostLogoBig}
                alt="PyCon 2025 Host Logo"
                style={{ backgroundColor: "white", objectFit: "cover", borderRadius: "50%" }}
              />
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
  border-top: 1px solid ${({ theme }) => theme.palette.primary.dark};
  border-bottom: 1px solid ${({ theme }) => theme.palette.primary.dark};
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.palette.primary.light};
  margin: 0;
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
    }
  }
`;

const Number = styled.span`
  font-size: 18px;
  font-weight: 400;
`;

const Question = styled.span`
  font-size: 18px;
  font-weight: 400;
  margin-left: 60px;
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  background-color: white;
  color: ${({ theme }) => theme.palette.primary.dark};
  font-size: 14px;
  font-weight: 400;
  width: 100%;
  height: 100%;
  padding: 20px 0 20px calc(35px + 18px + 60px); // top right bottom left
`;
