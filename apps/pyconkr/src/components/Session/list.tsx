import styled from "@emotion/styled";
import { Button, CircularProgress, Divider } from "@mui/material";
import { styled as muiStyled } from "@mui/material/styles";
import { Suspense } from "@suspensive/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as R from "remeda";

import BackendSessionAPISchemas from "../../../../../packages/common/src/schemas/backendSessionAPI";

const SessionItem: React.FC<{ session: BackendSessionAPISchemas.SessionSchema }> = Suspense.with(
  { fallback: <CircularProgress /> },
  ({ session }) => {
    const navigate = useNavigate();

    const speakerImageSrc =
      session.presentationSpeaker[0].image ||
      (R.isArray(session.presentationSpeaker[0].image) && !R.isEmpty(session.presentationSpeaker[0].image)) ||
      "";
    const urlSafeTitle = session.name
      .replace(/ /g, "-")
      .replace(/([.])/g, "_")
      .replace(/(?![0-9A-Za-zㄱ-ㅣ가-힣-_])./g, "");

    return (
      <>
        <SessionItemEl>
          <SessionItemImgContainer>
            {speakerImageSrc && <img src={session.presentationSpeaker[0].image} alt={session.presentationSpeaker[0].name} />}
          </SessionItemImgContainer>
          <SessionItemInfoContainer>
            <TagContainer>
              {session.presentationCategories.map((tag) => (
                <Tag key={tag.id}>{tag.name}</Tag>
              ))}
              {session.doNotRecord && <Tag>{"녹화 불가"}</Tag>}
            </TagContainer>
            <SessionTitleContainer>
              <kbd onClick={() => navigate(`/session/${session.id}#${urlSafeTitle}`)}>{session.name}</kbd>
            </SessionTitleContainer>
            <SessionSpeakerContainer>
              {session.presentationSpeaker.map((speaker) => (
                <kbd key={speaker.id}>{speaker.name}</kbd>
              ))}
            </SessionSpeakerContainer>
          </SessionItemInfoContainer>
        </SessionItemEl>
        <CategoryButtonDivider />
      </>
    );
  }
);

export const SessionListPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

  const [sessions, setSessions] = useState<BackendSessionAPISchemas.SessionSchema[]>(sessionDummyData);
  const [filteredSessions, setFilteredSessions] = useState<BackendSessionAPISchemas.SessionSchema[]>([]);

  useEffect(() => {
    setSessions(sessionDummyData);
  });

  useEffect(() => {
    const newFilteredSessions = sessions.filter((session) => {
      const sessionCategoryNames: string[] = session.presentationCategories.map((category) => category.name);
      return sessionCategoryNames.includes(selectedCategory);
    });
    setFilteredSessions(newFilteredSessions);
  }, [selectedCategory]);

  const CategoryButton: React.FC<{ category: string; isSelected: boolean }> = ({ category, isSelected }) => {
    return isSelected ? (
      <CategoryButtonSelectedStyle>{category}</CategoryButtonSelectedStyle>
    ) : (
      <CategoryButtonStyle
        onClick={() => {
          setSelectedCategory(category);
        }}
      >
        {category}
      </CategoryButtonStyle>
    );
  };

  const CategoryButtons: React.FC = () => {
    return (
      <>
        {categoriesDummyData.map((category) => {
          return <CategoryButton category={category} isSelected={category === selectedCategory} />;
        })}
      </>
    );
  };

  return (
    <SessionContainer>
      <SessionCategoryButtonContainer>
        <InfoTextContainer>{"* 발표 목록은 발표자 사정에 따라 변동될 수 있습니다."}</InfoTextContainer>
        <CategoryButtonDivider />
        <ButtonGroupContainer>
          <CategoryButtons />
        </ButtonGroupContainer>
        <CategoryButtonDivider />
      </SessionCategoryButtonContainer>
      {(selectedCategory === "전체" ? sessions : filteredSessions).map((session) => (
        <SessionItem key={session.presentationType.id} session={session} />
      ))}
    </SessionContainer>
  );
};

const sessionDummyData: BackendSessionAPISchemas.SessionSchema[] = [
  {
    id: "presentationId",
    name: "django ORM 관리하기",
    doNotRecord: false,
    presentationType: {
      id: "presentationTypeId",
      event: "eventId",
      name: "poetry 의존성 관리",
    },
    presentationCategories: [
      {
        id: "presentationCategories1",
        presentationType: "presentationTypeId",
        name: "블록체인",
      },
      {
        id: "presentationCategories2",
        presentationType: "presentationTypeId",
        name: "라이브러리 / 코어",
      },
    ],
    presentationSpeaker: [
      {
        id: "presentationSpeakerId1",
        presentation: "presentationId",
        user: "ksy0526",
        name: "강소영",
        biography: "다양한 언어를 공부합니다.",
        image: "https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI",
      },
    ],
  },
  {
    id: "presentationId",
    name: "uv로 python 프로젝트 관리하기",
    doNotRecord: true,
    presentationType: {
      id: "presentationTypeId",
      event: "eventId",
      name: "uv 의존성 관리",
    },
    presentationCategories: [
      {
        id: "presentationCategories1",
        presentationType: "presentationTypeId",
        name: "보안",
      },
      {
        id: "presentationCategories2",
        presentationType: "presentationTypeId",
        name: "실무",
      },
    ],
    presentationSpeaker: [
      {
        id: "presentationSpeakerId1",
        presentation: "presentationId",
        user: "ksy0526",
        name: "강소영",
        biography: "다양한 언어를 공부합니다.",
        image: "https://fastly.picsum.photos/id/737/200/200.jpg?hmac=YPktyFzukhcmeW3VgULbam5iZTWOMXfwf6WIBPpJD50",
      },
    ],
  },
];

const categoriesDummyData: string[] = [
  "전체",
  "교육",
  "데이터 과학",
  "라이브러리 / 코어",
  "보안",
  "블록체인",
  "실무",
  "오픈소스 / 커뮤니티",
  "웹 서비스",
  "인공지능",
  "일상 / 사회",
  "자동화",
  "컴퓨터 비전",
];

const CategoryButtonStyle = muiStyled(Button)(({ theme }) => ({
  color: theme.palette.primary.light,
  "&:hover": {
    color: theme.palette.primary.dark,
  },
}));

const CategoryButtonSelectedStyle = muiStyled(Button)(({ theme }) => ({
  color: theme.palette.primary.dark,
}));

const CategoryButtonDivider = muiStyled(Divider)(({ theme }) => ({
  bgcolor: theme.palette.primary.dark,
  borderColor: theme.palette.primary.dark,
}));

const SessionContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const InfoTextContainer = styled.div`
  padding-bottom: 0.5rem;
  text-align: right;
  font-size: 0.75rem;
  p {
    text-align: right;
    font-size: 0.75rem;
  }
`;

const SessionCategoryButtonContainer = styled.div``;

const ButtonGroupContainer = styled.div`
  display: flex;
`;

const SessionItemEl = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.75rem;
  width: 100%;
  gap: 1rem;

  color: var(--pico-h6-color);

  border-top: 1px solid var(--pico-muted-border-color);
  border-bottom: 1px solid var(--pico-muted-border-color);

  @media only screen and (max-width: 809px) {
    padding: 0rem;
    gap: 0.5rem;
  }
`;

const SessionItemImgContainer = styled.div`
  width: 6rem;
  height: 6rem;
  margin: 0.6rem 0.6rem 0.6rem 1.5rem;
  flex-shrink: 0;
  flex-grow: 0;

  border-radius: 50%;
  border: 1px solid var(--pico-muted-border-color);

  * {
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    max-width: 100%;
    max-height: 100%;
    border-radius: 50%;
  }

  @media only screen and (max-width: 809px) {
    width: 5rem;
    height: 5rem;
    margin: 0.25rem;
  }
`;

const SessionItemInfoContainer = styled.div`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-left: 1rem;

  flex-grow: 1;

  h4 {
    color: #febd99;
    margin-bottom: 0.2rem;
    cursor: pointer;
  }

  p {
    margin-bottom: 0.3rem;
    color: var(--pico-h3-color);
    font-size: 0.8rem;
    font-weight: bold;
  }

  @media only screen and (max-width: 809px) {
    h3 {
      font-size: 1.5rem;
    }

    p {
      font-size: 0.8rem;
      font-weight: bold;
    }
  }
`;

const SessionTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  kbd {
    color: ${({ theme }) => theme.palette.text.primary};
    gap: 0.5rem;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: bold;
    font-size: 1.25rem;
  }
`;

const SessionSpeakerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  kbd {
    padding-top: 0.25rem;
    font-size: 0.8rem;
    color: #4e869d;
  }
`;

const TagContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.25rem 0;
  gap: 0.35rem;
`;

const Tag = styled.kbd`
  background-color: white;
  padding: 0.2rem 0.4rem;
  font-size: 0.75rem;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.palette.primary.main};
  bordercolor: ${({ theme }) => theme.palette.primary.main};
  border: 1px solid;
  border-radius: 15px;
`;
