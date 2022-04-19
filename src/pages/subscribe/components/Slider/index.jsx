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
    <div style={{ position: 'relative' }}>
      <ButtonWrapper>
        <Button
          isHover={scrollPos.isStart}
          onClick={() => slide("LEFT")}
          disabled={scrollPos.isStart}
        >
          <ChevronLeftIcon style={{ width: '24px', height: '24px' }}/>
        </Button>
        <Button
          isHover={scrollPos.isEnd}
          onClick={() => slide("RIGHT")}
          disabled={scrollPos.isEnd}
        >
          <ChevronRightIcon style={{ width: '24px', height: '24px' }}/>
        </Button>
      </ButtonWrapper>
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
    </div>
  );
};

export default Slider;

const ButtonWrapper = styled.div`
  position: absolute;
  right: 0px;
  margin-top: -40px;
  display: flex;
  color: #9CA3AF;

`
const HoverCss = css`
  &:hover {
    color: white;
  }
`;

const ColorCss = css`
  color: #1F2937;
`;

const Button = styled.button`
  -webkit-appearance: button;
  background-color: transparent;
  background-image: none;
  text-transform: none;
  border: none;
  margin: 0;
  padding: 0;
  ${props => props.isHover ? ColorCss: HoverCss}
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