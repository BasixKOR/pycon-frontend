import { AccordionProps } from "@mui/material";
import * as React from "react";

type PHOpenOneFoldMgrPropType = {
  children: React.ReactElement<AccordionProps>[];
  resetKey?: string;
};

export const OneDetailsOpener: React.FC<PHOpenOneFoldMgrPropType> = (props) => {
  const childrenCount = React.Children.count(props.children);
  const initialFoldState = new Array(childrenCount).fill(false);
  const [oneFoldOpener, setOneFoldOpener] = React.useState(initialFoldState);
  const foldAll = () => setOneFoldOpener([...initialFoldState]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(foldAll, [props.resetKey]);

  const foldStateSwitcher =
    (index: number): ((event: React.SyntheticEvent<Element, Event>, expanded: boolean) => void) =>
    (event, expanded) => {
      event.preventDefault();
      event.stopPropagation();

      const newOneFoldOpener = [...initialFoldState];
      newOneFoldOpener[index] = expanded;

      setOneFoldOpener(newOneFoldOpener);
    };

  return (
    <>
      {React.Children.map(props.children, (child, index) =>
        React.cloneElement(child, { expanded: oneFoldOpener[index], onChange: foldStateSwitcher(index) })
      )}
    </>
  );
};
