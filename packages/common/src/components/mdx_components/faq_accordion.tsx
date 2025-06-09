import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion as MuiAccordion, AccordionDetails, AccordionSummary } from "@mui/material";
import styled from "@emotion/styled";
import * as React from "react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQAccordionProps {
  items: FAQItem[];
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ items }) => {
  return (
    <AccordionWrapper>
      {items.map((faq, index) => (
        <React.Fragment key={faq.id}>
          <StyledAccordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${faq.id}-content`}
              id={`panel${faq.id}-header`}
            >
              <Number>{faq.id}</Number>
              <Question>{faq.question}</Question>
            </AccordionSummary>
            <StyledAccordionDetails>{faq.answer}</StyledAccordionDetails>
          </StyledAccordion>
          {index !== items.length - 1 && <Divider />}
        </React.Fragment>
      ))}
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
  background-color: ${({ theme }) => `${theme.palette.primary.light}26`}; // 15% opacity (26 in hex)
  color: ${({ theme }) => theme.palette.primary.dark};
  font-size: 14px;
  font-weight: 400;
  padding: 20px 0 20px calc(35px + 18px + 60px); // top right bottom left
`;
