import { FC } from "react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

export const Confetti: FC = () => {
  const { width, height } = useWindowSize();
  return <ReactConfetti width={width} height={height} />;
};
