import styled from "@emotion/styled";
import { useEffect, useState } from "react";

import SponsorExample from "../../../assets/sponsorExample.svg?react";

interface Sponsor {
  id: number;
  name: string;
  Logo: React.ComponentType;
}

export default function Sponsor() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  // 16개의 임시 스폰서 데이터 생성
  useEffect(() => {
    const fetchSponsors = () => {
      const dummySponsors = Array(16)
        .fill(null)
        .map((_, index) => ({
          id: index + 1,
          name: `후원사 ${index + 1}`,
          Logo: SponsorExample,
        }));

      setSponsors(dummySponsors);
    };

    fetchSponsors();
  }, []);

  return (
    <SponsorSection aria-label="후원사 섹션">
      <SponsorTitle as="h4" role="heading" aria-level={4}>
        후원사 목록
      </SponsorTitle>
      <SponsorGrid role="list" aria-label="후원사 목록 그리드">
        {sponsors.map((sponsor) => (
          <SponsorItem key={sponsor.id} role="listitem">
            <SponsorButton type="button" aria-label={`${sponsor.name} 상세 정보 보기`}>
              <span className="sr-only">{sponsor.name}</span>
              <sponsor.Logo aria-hidden="true" />
            </SponsorButton>
          </SponsorItem>
        ))}
      </SponsorGrid>
    </SponsorSection>
  );
}

const SponsorSection = styled.section`
  width: 1067px;
  margin: 0 auto;
  margin-bottom: 140px;
`;

const SponsorTitle = styled.h4`
  font-weight: 600;
  font-size: 37px;
  text-align: center;
  margin: 0;
`;

const SponsorGrid = styled.div`
  margin-top: 101px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 35px;
  row-gap: 75px;
  justify-items: center;
`;

const SponsorItem = styled.div`
  width: 240px;
  height: 75px;
`;

const SponsorButton = styled.button`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:focus {
    outline: 2px solid #007aff;
    outline-offset: 4px;
    border-radius: 4px;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid #007aff;
    outline-offset: 4px;
    border-radius: 4px;
  }

  &:hover {
    // transform: scale(1.05);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
