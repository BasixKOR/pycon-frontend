import { ComponentProps, FC, ReactNode, useState } from "react";
type FallbackImageProps = ComponentProps<"img"> & {
  errorFallback: ReactNode;
};

export const FallbackImage: FC<FallbackImageProps> = ({ errorFallback, src, alt, ...props }) => {
  const [isError, setIsError] = useState(!src ? true : false);
  return isError ? errorFallback : <img src={src} alt={alt} {...props} onError={() => setIsError(true)} />;
};
