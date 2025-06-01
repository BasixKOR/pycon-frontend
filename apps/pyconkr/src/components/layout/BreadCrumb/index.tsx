import styled from "@emotion/styled";
import { useEffect, useState } from "react";

export default function BreadCrumb() {
  const [breadcrumbInfo, setBreadcrumbInfo] = useState({
    paths: [{ text: "홈", href: "/" }],
    title: "파이콘 한국 행동강령(CoC)",
  });

  useEffect(() => {
    const mockPathInfo = {
      paths: [
        { text: "홈", href: "/" },
        { text: "파이콘 한국", href: "/about" },
      ],
      title: "파이콘 한국 행동강령(CoC)",
    };
    setBreadcrumbInfo(mockPathInfo);
  }, []);

  return (
    <BreadCrumbContainer>
      <BreadcrumbPathContainer>
        {breadcrumbInfo.paths.map((item, index) => (
          <span key={index}>
            {index > 0 && <span className="separator">&gt;</span>}
            <a href={item.href}>{item.text}</a>
          </span>
        ))}
      </BreadcrumbPathContainer>
      <PageTitle>{breadcrumbInfo.title}</PageTitle>
    </BreadCrumbContainer>
  );
}

const BreadCrumbContainer = styled.div`
  width: 100%;
  padding: 14px 117px;
  background-color: rgba(255, 255, 255, 0.7);
  background-image: linear-gradient(
    rgba(255, 255, 255, 0.7),
    rgba(255, 255, 255, 0.45)
  );
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const BreadcrumbPathContainer = styled.div`
  font-size: 9.75px;
  font-weight: 300;
  color: #000000;
  display: flex;
  align-items: center;
  gap: 0;

  a {
    color: #000000;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .separator {
    color: #4e869d;
    margin: 0 5px;
  }
`;

const PageTitle = styled.h1`
  font-size: 27px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;
