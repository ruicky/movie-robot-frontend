import React, {useState} from 'react';
import { useIsTouch } from '@/hooks/useIsTouch';
import { Box, Typography } from "@mui/material";
import styled from "styled-components/macro";
import {
  CheckCircle as CheckCircleIcon,
  AccessTimeFilled as AccessTimeFilledIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import Transition from '@/components/Transition';
import { blue, purple, green, yellow, indigo } from "@mui/material/colors";


const ImgWrap = styled.img`
  border-radius: 10px;
  width: 100%;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
`;

const renderStatueIcon = (status) => {
  let icon;
  // eslint-disable-next-line default-case
  switch (status) {
    case '待审批':
      icon = <AccessTimeFilledIcon htmlColor={indigo[500]} />
      break;
    case '订阅中':
      icon = <NotificationsIcon htmlColor={yellow[500]} />
      break;
    case '已完成':
      icon = <CheckCircleIcon htmlColor={green[400]} />
  }
  return icon;
}

const TitleCard = ({mediaType='movie', year, title ,summary, image, status}) => {
  const isTouch = useIsTouch();
  const [showDetail, setShowDetail] = useState(false);
  return(
    <Box
      className={`transform duration-300 transition ${
        showDetail
          ? 'scale-105'
          : 'scale-100'
      }`}
      sx={{
        width: [144, 176],
        height: '100%',
        minHeight: '176px',
        position: 'relative',
        cursor: 'pointer',
      }}
      onMouseEnter={() => {
        if (!isTouch) {
          setShowDetail(true);
        }
      }}
      onMouseLeave={() => setShowDetail(false)}
      onClick={() => setShowDetail(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          setShowDetail(true);
        }
      }}
    >
      <Box sx={{
        position: 'absolute',
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        boxShadow: 1,
        cursor: 'default',
        width: '100%'
      }}>
        <Box sx= {{
          bgcolor: mediaType === 'movie' 
            ? blue[500]
            : purple[600],
          borderRadius: '9999px'
        }}>
          <Box
            sx={{
              px: 2,
              color: '#fff',
              textAlign: 'center',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center' 
            }}>
              {mediaType === 'tv' ? '电视节目' : '电影' }
            </Box>
        </Box>
        <Box>
          { renderStatueIcon(status)}
        </Box>
      </Box>
      <ImgWrap
        alt=''
        src={
          image
            ? image
            : '/static/img/poster_not_found_logo_top.png'
        }
      />


      <Transition
        show={showDetail}
        enter="transition transform opacity-0"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition transform opacity-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Box sx= {{
          position: 'absolute',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          bottom: 0,
          top: 0,
          p: 2,
          color: '#fff',
          borderRadius: '10px',
          background: 'linear-gradient(180deg, rgba(45, 55, 72, 0.4) 0%, rgba(45, 55, 72, 0.9) 100%)',
        }}>
          <Box sx={{
            display: 'flex',
            width: '100%',
            height: '100%',
            justifyContent: 'flex-end',
            flexDirection: 'column',
          }}>
            <Box>
              {
                year && <Typography variant="h5" gutterBottom component="div">{year}</Typography>
              }
            </Box>
            <Typography variant="h3" sx={{
              WebkitLineClamp: 3,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              wordBreak: 'break-word',
            }}>
              {title}
            </Typography>
            <Box sx={{
               display: '-webkit-box',
               overflow: 'hidden',
               WebkitBoxOrient: 'vertical',
               wordBreak: 'break-word',
               WebkitLineClamp: 5
            }}>
              {summary}
            </Box>
          </Box>
        </Box>
      </Transition>
    </Box>
  );
}

export default TitleCard;
