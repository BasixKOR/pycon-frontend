import { Pause, PlayArrow, Stop } from "@mui/icons-material";
import { Box, FormControlLabel, IconButton, Stack, Switch } from "@mui/material";
import * as React from "react";
import Lottie from "react-lottie";

type PlayState = "playing" | "paused" | "stopped";

type LottiePlayerStateType = {
  loop: boolean;
  isStopped: boolean;
  isPaused: boolean;
};

export const LottieDebugPanel: React.FC<{ animationData: unknown }> = ({ animationData }) => {
  const [playerState, setPlayerState] = React.useState<LottiePlayerStateType>({
    loop: true,
    isStopped: false,
    isPaused: false,
  });

  const toggleLoop = () => setPlayerState((ps) => ({ ...ps, loop: !ps.loop }));
  const setPlayState = (playState: PlayState) => {
    if (playState === "playing") setPlayerState((ps) => ({ ...ps, isStopped: false, isPaused: false }));
    if (playState === "paused") setPlayerState((ps) => ({ ...ps, isStopped: false, isPaused: true }));
    if (playState === "stopped") setPlayerState((ps) => ({ ...ps, isStopped: true, isPaused: true }));
  };

  const stop = () => setPlayState("stopped");
  const togglePause = () => setPlayState(playerState.isPaused ? "playing" : "paused");

  return (
    <Stack direction="column">
      <Box>
        <Lottie
          isStopped={playerState.isStopped}
          isPaused={playerState.isPaused}
          options={{
            animationData,
            loop: playerState.loop,
            autoplay: true,
            rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
          }}
        />
      </Box>
      <Stack direction="row" spacing={2}>
        <IconButton onClick={togglePause} children={playerState.isPaused ? <PlayArrow /> : <Pause />} />
        <IconButton onClick={stop} children={<Stop />} />
        <FormControlLabel control={<Switch checked={playerState.loop} onChange={toggleLoop} />} label="반복 재생" />
      </Stack>
    </Stack>
  );
};
