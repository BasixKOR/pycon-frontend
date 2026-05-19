import { FC } from "react";

import { LinkHandler } from "./link_handler";

const urlRegex = /(mailto:[\w.-]+@[\w.-]+\.[a-zA-Z]{2,})|(https?:\/\/[^\s]+)/gi;

export const AutoTextLinking: FC<{ children: string }> = ({ children }) => {
  const convertedChildren = children
    .split(urlRegex)
    .filter((text) => text !== undefined)
    .map((text) => (text.match(urlRegex) ? <LinkHandler href={text} children={text} /> : text));
  return <span children={convertedChildren} />;
};
