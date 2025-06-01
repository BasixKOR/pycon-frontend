import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import SponsorExample from "../../../assets/sponsorExample.svg?react";
import { useSponsor } from "../../../contexts/SponsorContext";

interface Sponsor {
  id: number;
  name: string;
  Logo: React.ComponentType;
}

export default function Sponsor() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const { isVisible } = useSponsor();

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

  if (!isVisible) return null;

  return (
    <SponsorContainer>
      <SponsorTitle>후원사 목록</SponsorTitle>
      <SponsorGrid>
        {sponsors.map((sponsor) => (
          <SponsorItem key={sponsor.id}>
            <sponsor.Logo />
          </SponsorItem>
        ))}
      </SponsorGrid>
    </SponsorContainer>
  );
}

const SponsorContainer = styled.div`
  width: 1067px;
  margin: 0 auto;
  margin-bottom: 140px;
`;

const SponsorTitle = styled.h5`
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
  display: flex;
  align-items: center;
  justify-content: center;
`;
