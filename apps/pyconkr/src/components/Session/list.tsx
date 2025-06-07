import styled from "@emotion/styled";
import * as Common from "@frontend/common";
import { CircularProgress } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as R from "remeda";

import SessionAPIs from "../../../../../packages/common/src/apis/session";
import BackendSessionAPISchemas from "../../../../../packages/common/src/schemas/backendSessionAPI";

const SessionItem: React.FC<{ session: BackendSessionAPISchemas.SessionSchema }> = ({ session }) => {
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
    <SessionItemEl>
      <SessionItemImgContainer>
        <ErrorBoundary
          fallback={
            <Common.Components.CenteredPage>문제가 발생했습니다, 새로고침을 해주세요.</Common.Components.CenteredPage>
          }
        >
          <Suspense
            fallback={
              <Common.Components.CenteredPage>
                <CircularProgress />
              </Common.Components.CenteredPage>
            }
          >
            {speakerImageSrc}
          </Suspense>
        </ErrorBoundary>
        {<Common.Components.CenteredPage>문제가 발생했습니다, 새로고침을 해주세요.</Common.Components.CenteredPage>}
      </SessionItemImgContainer>
      <SessionItemInfoContainer>
        <h4 onClick={() => navigate(`/session/${session.presentationType.id}#${urlSafeTitle}`)}>{session.name}</h4>
        <p>{session.name}</p>
        <SessionSpeakerContainer>
          by{" "}
          {session.presentationSpeaker.map((speaker) => (
            <kbd key={speaker.id}>{speaker.name}</kbd>
          ))}
        </SessionSpeakerContainer>
        <TagContainer>
          {session.presentationCategories.map((tag) => (
            <Tag key={tag.id}>{tag.name}</Tag>
          ))}
          {session.doNotRecord && <Tag>{"녹화 불가"}</Tag>}
        </TagContainer>
      </SessionItemInfoContainer>
    </SessionItemEl>
  );
};

const backendAdminAPIClient = Common.Hooks.BackendAdminAPI.useBackendAdminClient();

const SessionListInner = async () => {
  const data = await (async () => {
    return await SessionAPIs.sessionList(backendAdminAPIClient)();
  })();
  const [currentTag, setTag] = useState<string | null>(null);
  const setOrUnsetTag = (tag: string) => setTag(currentTag === tag ? null : tag);
  const currentTagNames = data.map((d) => d.presentationType.name);
  const sessionOnlyData = data
    .filter((d) => d.presentationType.name === "Session")
    .filter((d) => currentTag === null || currentTagNames.includes(d.presentationType.name));
  const tags = Array.from(new Set(data.flatMap((session) => session.presentationType.name))).sort();
  return (
    <>
      <hr style={{ margin: 0 }} />
      <TagFilterBtnContainer>
        <div>
          {tags.map((tag) => (
            <TagFilterBtn key={tag} onClick={() => setOrUnsetTag(tag)} className={tag === currentTag ? "selected" : ""}>
              {tag}
            </TagFilterBtn>
          ))}
        </div>
      </TagFilterBtnContainer>
      {sessionOnlyData.map((session) => (
        <SessionItem key={session.presentationType.id} session={session} />
      ))}
    </>
  );
};

export const SessionListPage = () => {
  const SessionList = () => {
    return (
      <ErrorBoundary fallback={<h4>{"세션 목록을 불러오는 중 에러가 발생했습니다."}</h4>}>
        <Suspense fallback={<h4>{"세션 목록을 불러오는 중 입니다."}</h4>}>
          <SessionListInner />
        </Suspense>
      </ErrorBoundary>
    );
  };

  return <SessionList />;
};

const SessionItemEl = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.75rem;
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
  margin: 0.6rem;
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

const SessionSpeakerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  color: var(--pico-h6-color);
  font-size: 0.6rem;

  img {
    width: 0.75rem;
    height: 0.75rem;
    min-width: 0.75rem;
    min-height: 0.75rem;
    max-width: 0.75rem;
    max-height: 0.75rem;
    border-radius: 50%;
    background-color: #f0f0f0;
  }

  kbd {
    background-color: #def080;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;

    font-size: 0.6rem;
  }
`;

const TagContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.25rem 0;
  gap: 0.25rem;
`;

const Tag = styled.kbd`
  background-color: #b0a8fe;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;

  font-size: 0.6rem;
`;

const TagFilterBtnContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TagFilterBtn = styled.button`
  background-color: rgba(0, 0, 0, 0);
  border: none;
  outline: none;
  padding: 0.25rem 0.5rem;
  margin: 0.25rem;
  font-size: 0.8rem;

  &:focus,
  button::-moz-focus-inner {
    outline: none !important;
  }

  &.selected {
    background-color: #b0a8fe;
    color: black;
    font-weight: bold;
  }
`;
