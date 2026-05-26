import { AccordionProps } from "@mui/material";
import { Children, FC, ReactElement, SyntheticEvent, cloneElement, useEffect, useState } from "react";
type PHOpenOneFoldMgrPropType = {
  children: ReactElement<AccordionProps>[];
  resetKey?: string;
};

export const OneDetailsOpener: FC<PHOpenOneFoldMgrPropType> = (props) => {
  const childrenCount = Children.count(props.children);
  const initialFoldState = new Array(childrenCount).fill(false);
  const [oneFoldOpener, setOneFoldOpener] = useState(initialFoldState);
  const foldAll = () => setOneFoldOpener([...initialFoldState]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(foldAll, [props.resetKey]);

  const foldStateSwitcher =
    (index: number): ((event: SyntheticEvent<Element, Event>, expanded: boolean) => void) =>
    (event, expanded) => {
      event.preventDefault();
      event.stopPropagation();

      const newOneFoldOpener = [...initialFoldState];
      newOneFoldOpener[index] = expanded;

      setOneFoldOpener(newOneFoldOpener);
    };

  return (
    <>{Children.map(props.children, (child, index) => cloneElement(child, { expanded: oneFoldOpener[index], onChange: foldStateSwitcher(index) }))}</>
  );
};
