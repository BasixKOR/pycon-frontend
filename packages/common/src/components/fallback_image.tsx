import * as React from "react";

type FallbackImageProps = React.ComponentProps<"img"> & {
  errorFallback: React.ReactNode;
};

export const FallbackImage: React.FC<FallbackImageProps> = ({ src, alt, errorFallback }) => {
  const [isError, setIsError] = React.useState(!src ? true : false);
  return isError ? errorFallback : <img src={src} alt={alt} onError={() => setIsError(true)} />;
};
