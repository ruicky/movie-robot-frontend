import React, {useState, useEffect, useCallback} from 'react';
import { useIsTouch } from '@/hooks/useIsTouch';
import { Box, Typography, Button } from "@mui/material";
import styled, {css} from "styled-components/macro";
import {
  CheckCircle as CheckCircleIcon,
  AccessTimeFilled as AccessTimeFilledIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import Transition from '@/components/Transition';
import { blue, purple, green, yellow, indigo } from "@mui/material/colors";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SubscribeDialog from '../SubscribeDialog';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteConfrimDialog from '../DeleteConfrimDialog';


const ImgWrap = styled.img`
  border-radius: 10px;
  width: 100%;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
`;

const renderStatueIcon = (status) => {
  // status: 0: 已订阅待处理，1: 已处理，2:未订阅
  let icon;
  // eslint-disable-next-line default-case
  switch (status) {
    case '待审批':
      icon = <AccessTimeFilledIcon htmlColor={indigo[500]} />
      break;
    case 0:
      icon = <NotificationsIcon htmlColor={yellow[500]} />
      break;
    case 1:
      icon = <CheckCircleIcon htmlColor={green[400]} />
  }
  return icon;
}

const TitleCard = ({id, mediaType, year, title ,summary, image, status, canExpand = false}) => {
  const isTouch = useIsTouch();
  const [showDetail, setShowDetail] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  const requestComplete = useCallback((newStatus) => {
    setCurrentStatus(newStatus);
    setShowRequestModal(false);
  }, []);

  // HACK: 目前已知都有底部操作按钮，不排除将来只做海报展示，故保留此配置项
  const isHaveBottom = true;

  return(
    <CardWrapper canExpand={canExpand}>
      <SubscribeDialog
        open={showRequestModal}
        onComplete={requestComplete}
        handleClose={() => setShowRequestModal(false)}
        data={({id:id, name:title})}
      />
      <DeleteConfrimDialog
        open={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        data={({id:id, name:title})}
      />
      <Box
        className={`transform duration-300 transition ${
          showDetail
            ? 'scale-105'
            : 'scale-100'
        }`}
        sx={{
          width: '100%',
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
            bgcolor: mediaType?.toUpperCase() === 'MOVIE' 
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
                {mediaType?.toUpperCase() === 'TV' ? '电视节目' : '电影' }
              </Box>
          </Box>
          <Box>
            { renderStatueIcon(status)}
          </Box>
        </Box>
        <ImgWrap
          referrerPolicy="no-referrer"
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
              paddingBottom: isHaveBottom ? '44px' : '8px' ,
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
                whiteSpace: 'normal',
                lineHeight: '16px',
                fontSize: '12px',
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word',
                WebkitLineClamp: isHaveBottom ? 3 : 5,
              }}>
                {summary}
              </Box>
            </Box>
            <RequestWrapper>
              {
                currentStatus === 2 && <Button
                  sx={{width: '100%'}}
                  variant="contained"
                  startIcon={<FileDownloadIcon />}
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowRequestModal(true);
                  }}
                >
                  提交订阅
                </Button>
              }
              {
                [1,0].includes(currentStatus) && <Button
                  color="error"
                  sx={{width: '100%'}}
                  variant="contained"
                  startIcon={<DeleteForeverIcon />}
                  size="small"
                  onClick={(e) => {
                    e.preventDefault(); 
                    setShowDeleteModal(true);
                  }}
                >
                  删除订阅
                </Button>
              }
            </RequestWrapper>
          </Box>
          

        </Transition>
      </Box>
    </CardWrapper>
    
  );
}

export default TitleCard;

const ExpandCss = css`
  @media (min-width: 640px) {
    width: 144px;
  }
  @media (min-width: 768px) {
    width: 176px;
  }
`;

const CardWrapper = styled.div`
  width: ${props => props.canExpand ? '100%' : '144px'};
  ${props => props.canExpand ? undefined : ExpandCss}
`;

const RequestWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 8px;
`;