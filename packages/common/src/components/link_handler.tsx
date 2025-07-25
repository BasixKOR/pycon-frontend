import * as React from "react";
import { Link } from "react-router-dom";

const EXTERNAL_PROTOCOLS = ["http://", "https://", "mailto:", "tel:"];

export const LinkHandler: React.FC<React.PropsWithChildren<{ href: string }>> = ({ href, ...props }) => {
  // If the href starts with "http" or "https", it's an external link
  if (EXTERNAL_PROTOCOLS.some((protocol) => href.startsWith(protocol))) return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;

  return <Link to={href} {...props} />;
};
