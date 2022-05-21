import React, {useState, useEffect } from 'react';
import { useWindowSize } from "@/utils/hooks";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { subtract as _subtract, divide as _divide } from 'lodash';


export const useEpisodesDisplay = (episodes) => {
  const {width: windowWidth} = useWindowSize();
  const [calcCount, setCalcCount] = useState();
  const [isOver, setIsOver] = useState(false);
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.down("md"));
  
  useEffect(() => {
      const sizeEnum = {
          sm: 87,
          md: 263,
          lg: 568
      }
      let diff;
      if (isSmDown) {
        diff = sizeEnum['sm'];
      } else if (!isSmDown && isMdUp) {
        diff = sizeEnum['md'];
      } else {
        diff = sizeEnum['lg'];
      }
      console.log('diff-->', diff);
      const count = Math.floor(_divide(_subtract(windowWidth, diff), 40)) 
      console.log('count-->', count);
      setCalcCount(count)
      setIsOver(count < episodes.length)
  }, [windowWidth, episodes.length])

  return [calcCount, isOver]
}