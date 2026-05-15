import { Pause, PlayArrow, Stop } from "@mui/icons-material";
import { Box, CircularProgress, FormControlLabel, IconButton, Stack, Switch } from "@mui/material";
import { ErrorBoundary } from "@suspensive/react";
import { CSSProperties, FC, useEffect, useState } from "react";
import Lottie, { Options } from "react-lottie";

import { isValidHttpUrl } from "@frontend/common/utils/string";

import { ErrorFallback } from "./error_handler";

type PlayState = "playing" | "paused" | "stopped";

type LottiePlayerProps = {
  data: unknown;
  playState?: PlayState;
  disableLoop?: boolean;
  renderSettings?: Options["rendererSettings"];
  style?: CSSProperties;
};

type LottiePlayerStateType = {
  playState: PlayState;
};

type LottieDebugPanelStateType = LottiePlayerStateType & {
  loop: boolean;
};

const playStateToLottiePlayerState = (playState: PlayState): { isStopped: boolean; isPaused: boolean } => {
  if (playState === "playing") return { isStopped: false, isPaused: false };
  if (playState === "paused") return { isStopped: false, isPaused: true };
  return { isStopped: true, isPaused: true };
};

export const LottieDebugPanel: FC<LottiePlayerProps> = ({ data, playState = "playing", disableLoop = false, renderSettings = {}, style }) => {
  const [playerState, setPlayerState] = useState<LottieDebugPanelStateType>({
    playState,
    loop: !disableLoop,
  });
  const isPlaying = playerState.playState === "playing";

  const toggleLoop = () => setPlayerState((ps) => ({ ...ps, loop: !ps.loop }));
  const setPlayState = (playState: PlayState) => setPlayerState((ps) => ({ ...ps, playState }));

  const stop = () => setPlayState("stopped");
  const togglePause = () => setPlayState(!isPlaying ? "playing" : "paused");

  return (
    <Stack direction="column">
      <Box>
        <Lottie
          {...playStateToLottiePlayerState(playerState.playState)}
          options={{
            animationData: data,
            loop: playerState.loop,
            autoplay: true,
            rendererSettings: { preserveAspectRatio: "xMidYMid slice", ...renderSettings },
          }}
          style={style}
        />
      </Box>
      <Stack direction="row" spacing={2}>
        <IconButton onClick={togglePause} children={!isPlaying ? <PlayArrow /> : <Pause />} />
        <IconButton onClick={stop} children={<Stop />} />
        <FormControlLabel control={<Switch checked={playerState.loop} onChange={toggleLoop} />} label="반복 재생" />
      </Stack>
    </Stack>
  );
};

export const LottiePlayer: FC<LottiePlayerProps> = ({ data, playState = "playing", disableLoop = false, renderSettings = {}, style }) => (
  <Lottie
    {...playStateToLottiePlayerState(playState)}
    options={{
      animationData: data,
      loop: !disableLoop,
      autoplay: playState === "playing",
      rendererSettings: { preserveAspectRatio: "xMidYMid slice", ...renderSettings },
    }}
    style={style}
  />
);

type NetworkLottiePlayerProps = Omit<LottiePlayerProps, "data"> & {
  url: string;
  fetchOptions?: RequestInit;
};

type NetworkLottiePlayerStateType = {
  data?: unknown | null;
};

export const NetworkLottiePlayer: FC<NetworkLottiePlayerProps> = ErrorBoundary.with({ fallback: ErrorFallback }, (props) => {
  const [playerState, setPlayerState] = useState<NetworkLottiePlayerStateType>({});

  useEffect(() => {
    (async () => {
      if (!isValidHttpUrl(props.url)) throw new Error("Invalid URL for NetworkLottiePlayer: " + props.url);

      const data = JSON.parse(await (await fetch(props.url, props.fetchOptions)).text());
      setPlayerState((ps) => ({ ...ps, data }));
    })();
  }, [props.url, props.fetchOptions]);

  return playerState.data === undefined ? <CircularProgress /> : <LottiePlayer {...props} data={playerState.data} />;
});
