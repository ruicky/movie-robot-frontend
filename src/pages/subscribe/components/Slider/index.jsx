import React,{useState, useCallback, useRef, useEffect} from 'react';
import { debounce } from 'lodash';
import { useSpring } from 'react-spring';
import TitleCard from '../TitleCard';
import { Box } from "@mui/material";
import styled, {css} from "styled-components/macro";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import Placeholder from '../TitleCard/Placeholder';
import Empty from '../Empty';
import './slider.css';


const Slider = ({
  sliderKey,
  items,
  isLoading,
  isEmpty,
}) => {
  const containerRef = useRef(null);
  const [scrollPos, setScrollPos] = useState({ isStart: true, isEnd: false });

  const handleScroll = useCallback(() => {
    const scrollWidth = containerRef.current?.scrollWidth ?? 0;
    const clientWidth =
      containerRef.current?.getBoundingClientRect().width ?? 0;
    const scrollPosition = containerRef.current?.scrollLeft ?? 0;

    if (!items || items?.length === 0) {
      setScrollPos({ isStart: true, isEnd: true });
    } else if (clientWidth >= scrollWidth) {
      setScrollPos({ isStart: true, isEnd: true });
    } else if (
      scrollPosition >=
      (containerRef.current?.scrollWidth ?? 0) - clientWidth
    ) {
      setScrollPos({ isStart: false, isEnd: true });
    } else if (scrollPosition > 0) {
      setScrollPos({ isStart: false, isEnd: false });
    } else {
      setScrollPos({ isStart: true, isEnd: false });
    }
  }, [items]);

  const debouncedScroll = useCallback(
    debounce(() => handleScroll(), 50),
    [handleScroll]
  );
  useEffect(() => {
    const handleResize = () => {
      debouncedScroll();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [debouncedScroll]);

  useEffect(() => {
    handleScroll();
  }, [items, handleScroll]);

  const onScroll = () => {
    debouncedScroll();
  };

  const [, setX] = useSpring(() => ({
    from: { x: 0 },
    to: { x: 0 },
    onChange: (results) => {
      if (containerRef.current) {
        containerRef.current.scrollLeft = results.value.x;
      }
    },
  }));

  const slide = (direction) => {
    const clientWidth =
      containerRef.current?.getBoundingClientRect().width ?? 0;
    const cardWidth =
      containerRef.current?.firstElementChild?.getBoundingClientRect().width ??
      0;
    const scrollPosition = containerRef.current?.scrollLeft ?? 0;
    const visibleItems = Math.floor(clientWidth / cardWidth);
    const scrollOffset = scrollPosition % cardWidth;

    if (direction === "LEFT") {
      const newX = Math.max(
        scrollPosition - scrollOffset - visibleItems * cardWidth,
        0
      );
      setX.start({
        from: { x: scrollPosition },
        to: { x: newX },
        onChange: (results) => {
          if (containerRef.current) {
            containerRef.current.scrollLeft = results.value.x;
          }
        },
        reset: true,
        config: { friction: 60, tension: 500, velocity: 20 },
      });

      if (newX === 0) {
        setScrollPos({ isStart: true, isEnd: false });
      } else {
        setScrollPos({ isStart: false, isEnd: false });
      }
    } else if (direction === "RIGHT") {
      const newX = Math.min(
        scrollPosition - scrollOffset + visibleItems * cardWidth,
        containerRef.current?.scrollWidth ?? 0 - clientWidth
      );
      setX.start({
        from: { x: scrollPosition },
        to: { x: newX },
        onChange: (results) => {
          if (containerRef.current) {
            containerRef.current.scrollLeft = results.value.x;
          }
        },
        reset: true,
        config: { friction: 60, tension: 500, velocity: 20 },
      });

      if (newX >= (containerRef.current?.scrollWidth ?? 0) - clientWidth) {
        setScrollPos({ isStart: false, isEnd: true });
      } else {
        setScrollPos({ isStart: false, isEnd: false });
      }
    }
  };

  return (
    <SliderWrapper className="scrollbuttons-scroller">
      <Box container id="scrollBtn" className="scrollbuttons">
        <div className={`scrollbuttoncontainer scrollbuttoncontainer-left ${scrollPos.isStart && 'hide'}`}>
          <ScrollLeftButton onClick={() => slide("LEFT")}>
            <ChevronLeftIcon style={{ width: '50px', height: '50px', color: '#fff' }} />
          </ScrollLeftButton>
        </div>
        <div className={`scrollbuttoncontainer scrollbuttoncontainer-right ${scrollPos.isEnd && 'hide'}`}>
          <ScrollLeftButton onClick={() => slide("RIGHT")}>
            <ChevronRightIcon  style={{ width: '50px', height: '50px', color: '#fff' }} />
          </ScrollLeftButton>
        </div>
      </Box>
      <ListWrapper
        ref={containerRef}
        onScroll={onScroll}
      >
        {
          items?.map((item, index) => (
            <Item key={`${sliderKey}-${index}`}>
              {item}
            </Item>
          ))
        }
        {
          isLoading &&
            [...Array(10)].map((_item, i) => (
              <div
                key={`placeholder-${i}`}
                style ={{
                  display: 'inline-block',
                  pading: '0 8px',
                  verticalAlign: 'top'
                }}
              >
                <Placeholder />
              </div>
          ))
        }
        {
          isEmpty && <Empty />

        }
      </ListWrapper>
    </SliderWrapper>
  );
};

export default Slider;

const SliderWrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

const ScrollLeftButton = styled.button`
  margin: 0;
  outline: 0;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  box-sizing: border-box;
  background: 0 0;
  text-align: center;
  font-size: inherit;
  cursor: pointer;
  z-index: 0;
  border: 0;
  width: auto;
  height: auto;
  position: relative;
  border: 0;
  border-radius: 50%;
  justify-content: center;
  overflow: hidden;
  @media(hover: hover) and (pointer:fine) {
    -webkit-transition: -webkit-transform 160ms ease-in-out;
    -o-transition: transform 160ms ease-in-out;
    transition: transform 160ms ease-in-out
  }
`;

const HoverCss = css`
  &:hover {
    color: white;
  }
`;

const ColorCss = css`
  color: #1F2937;
`;


const ListWrapper = styled.div`
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  position: relative;
  margin: -8px -16px;
  overflow-y: auto;
  overflow-x: scroll;
  overscroll-behavior-x: contain;
  white-space: nowrap;
  padding: 8px;
`;

const Item = styled.div`
  display: inline-block;
  padding-left: 8px;
  padding-right: 8px;
  vertical-align: top;
`;