
import styled from "@emotion/styled";
import { evaluate } from "@mdx-js/mdx";
import { MDXProvider } from "@mdx-js/react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import * as runtime from "react/jsx-runtime";

// styled 컴포넌트 방식
const StyledCard = styled(Card)`
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-4px);
  }
`;

const StyledCardContent = styled(CardContent)`
  animation: fadeIn 0.5s ease-in;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const MdiTestPage: React.FC = () => {
  const [mdxInput, setMdxInput] = useState("");
  const [Content, setContent] = useState<React.ComponentType>(() => () => null);
  const [count, setCount] = useState(0);

  const handleInputChange = async (text: string) => {
    setMdxInput(text);
    try {
      const { default: Content } = await evaluate(text, {
        ...runtime,
        baseUrl: import.meta.url,
      });
      setContent(() => Content);
    } catch (error) {
      console.error("MDX 변환 오류:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <StyledCard sx={{ mb: 3 }}>
        <StyledCardContent>
          <Typography variant="h4" gutterBottom>
            MUI 테스트
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button variant="contained" onClick={() => setCount(count + 1)}>
              카운트: {count}
            </Button>
            <Button variant="outlined" color="secondary">
              세컨더리
            </Button>
          </Stack>
          <TextField
            fullWidth
            label="테스트 입력"
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </StyledCardContent>
      </StyledCard>

      <Typography variant="h5" gutterBottom>
        MDX 에디터
      </Typography>
      <TextField
        multiline
        fullWidth
        minRows={4}
        value={mdxInput}
        onChange={(e) => handleInputChange(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Card>
        <CardContent>
          <MDXProvider>
            <Content />
          </MDXProvider>
        </CardContent>
      </Card>
    </Box>
  );
}
