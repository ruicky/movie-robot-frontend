/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react';
import { Box } from "@mui/material";
import styled from "styled-components/macro";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const PersonCard = ({
  profilePath,
  name,
  subName,
}) => {
  const [isHovered, setHovered] = useState(false);
  return (
    <a
      style={{ width: '100%' }}
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setHovered(true);
          }
        }}
        role="link"
        tabIndex={0}
    >
      <Box
        className={`transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
        sx={{
          position: 'relative',
          width: '100%',
          cursor: 'pointer',
          borderRadius: '12px',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <ContentWrapper>
          <ImgDiv>
            {
              profilePath
                ? (<ImgWrapper>
                  <img src={profilePath} />
                </ImgWrapper>)
                : (<AccountCircleIcon style={{ height: '100%'}} />)
            }
          </ImgDiv>
          <NameWrapper>
            {name}
          </NameWrapper>
          {
            subName && <SubNameWrapper>
              {subName}
            </SubNameWrapper>
          }
          <BottomWrapper style={{
            backgroundImage: isHovered
              ? 'linear-gradient(to top, rgb(17, 24, 39), rgba(17, 24, 39, 0))'
              : 'linear-gradient(to top, rgb(31, 41, 55), rgba(31, 41, 55, 0))'
          }} />

        </ContentWrapper>

      </Box>

    </a>
  );
}

export default PersonCard;

const ContentWrapper = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding: '8px';
`;

const ImgDiv = styled.div`
  position: relative;
  margin-top: 8px;
  margin-bottom: 16px;
  display: flex;
  height: 50%;
  width: 100%;
  justify-content: center;
`;

const ImgWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 75%;
  overflow: hidden;
  border-radius: 9999px;
`;

const NameWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  font-weight: 700;
`;

const SubNameWrapper = styled.div`
  overflow: hidden;
  white-space: normal;
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  color: #D1D5DB;
  webkit-line-clamp: 2;
  display: '-webkit-box';
  overflow: 'hidden';
  Webkit-box-orient: 'vertical';
`;

const BottomWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: 48px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
`;