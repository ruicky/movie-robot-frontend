import React, {useCallback, useEffect, useState} from 'react';
import {useIsTouch} from '@/hooks/useIsTouch';
import {Box, Button, Stack, Typography} from "@mui/material";
import styled, {css} from "styled-components/macro";
import {
    AccessTimeFilled as AccessTimeFilledIcon,
    Autorenew,
    CheckCircle as CheckCircleIcon,
    DeleteForever as DeleteForeverIcon,
    FileDownload as FileDownloadIcon,
    FilterList,
    Notifications as NotificationsIcon,
} from '@mui/icons-material';
import Transition from '@/components/Transition';
import {blue, cyan, green, grey, indigo, yellow} from "@mui/material/colors";
import SubscribeDialog from '../SubscribeDialog';
import DeleteConfrimDialog from '../DeleteConfrimDialog';
import ReNewDialog from "@/pages/subscribe/components/ReNewDialog";
import {jumpUrl} from '@/utils/urlUtils';
import {getSub} from "@/utils/subscribe";
import {getFilterConfigList} from "@/api/ConfigApi";


const ImgWrap = styled.img`
  border-radius: 10px;
  width: 100%;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  object-fit: cover;
`;

const renderStatueIcon = (status) => {
    // status: 0: 已订阅待处理，1: 已处理，2:洗版中
    let icon;
    // eslint-disable-next-line default-case
    switch (status) {
        case '待审批':
            icon = <AccessTimeFilledIcon htmlColor={indigo[500]}/>
            break;
        case 0:
            icon = <NotificationsIcon htmlColor={yellow[500]}/>
            break;
        case 1:
            icon = <CheckCircleIcon htmlColor={green[400]}/>
            break;
        case 2:
            icon = <Autorenew htmlColor={blue[500]}/>
            break;
    }
    return icon;
}
const MediaTypeTag = ({mediaType}) => {

}
const DeleteSubButton = ({setShowDeleteModal}) => {
    return (
        <Button
            color="error"
            variant="contained"
            startIcon={<DeleteForeverIcon/>}
            size="small"
            sx={{width: '100%'}}
            onClick={(e) => {
                e.preventDefault();
                setShowDeleteModal(true);
            }}
        >
            删除
        </Button>
    )
}
const SetFilterButton = ({
                             status,
                             sub_id,
                             media_type,
                             setRenewFormData,
                             setShowReNewModal,
                             setShowDownloadMode
                         }) => {
    const resetFilter = async () => {
        const data = await getSub(sub_id)
        const values = data?.filter_config ? JSON.parse(data?.filter_config) : null;
        setRenewFormData(values)
        setShowReNewModal(true);
    }
    const reVersion = status === 1;
    return (
        <Button
            color={reVersion ? "info" : "success"}
            sx={{width: '100%'}}
            variant="contained"
            startIcon={reVersion ? <Autorenew/> : <FilterList/>}
            size="small"
            onClick={async (e) => {
                e.preventDefault();
                setShowDownloadMode(!reVersion && media_type === "Movie" && status !== 2);
                await resetFilter()
            }}
        >
            {reVersion ? "洗版" : "过滤"}
        </Button>
    )
}
const TitleCard = ({
                       sub_id, id, mediaType, year, subject, title, summary, image, status, url, canExpand = false,
                       showBottomTitle = true, extra,filterNameList
                   }) => {
    const isTouch = useIsTouch();
    const [showDetail, setShowDetail] = useState(false);
    const [showDownloadMode, setShowDownloadMode] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showReNewModal, setShowReNewModal] = useState(false);
    const [renewFormData, setRenewFormData] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(status);

    useEffect(() => {
        setCurrentStatus(status);
    }, [status]);

    const requestComplete = useCallback((newStatus) => {
        setCurrentStatus(newStatus);
        setShowRequestModal(false);
    }, []);
    const reNewComplete = useCallback((newStatus) => {
        setCurrentStatus(newStatus);
        setShowReNewModal(false);
    }, []);
    const deleteComplete = useCallback((newStatus) => {
        setCurrentStatus(newStatus);
        setShowDeleteModal(false);
    }, []);
    // HACK: 目前已知都有底部操作按钮，不排除将来只做海报展示，故保留此配置项
    const isHaveBottom = true;
    const openUrl = (httpUrl, appUrl) => {
        if (!httpUrl || !appUrl) {
            return;
        }
        jumpUrl(httpUrl, appUrl)
    }
    return (
        <CardWrapper canExpand={canExpand}>
            <SubscribeDialog
                open={showRequestModal}
                onComplete={requestComplete}
                handleClose={() => setShowRequestModal(false)}
                data={({id: id, name: title, year})}
                filterNameList={filterNameList}
            />
            <ReNewDialog
                showDownloadMode={showDownloadMode}
                open={showReNewModal}
                onComplete={reNewComplete}
                renewFormData={renewFormData}
                handleClose={() => setShowReNewModal(false)}
                data={({id: id, name: title, year, sub_id: sub_id})}
            />
            <DeleteConfrimDialog
                open={showDeleteModal}
                onComplete={deleteComplete}
                handleClose={() => setShowDeleteModal(false)}
                data={({id: id, name: title, year, sub_id: sub_id})}
            />
            <CardContainer
                className={`${
                    showDetail
                        ? 'scale-105'
                        : 'scale-100'
                }`}
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
                <ImgContainer>
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
                        <Box sx={{
                            bgcolor: mediaType?.toUpperCase() === 'MOVIE'
                                ? cyan[500]
                                : grey[800],
                            borderRadius: '9999px'
                        }}>
                            {mediaType && <Box
                                sx={{
                                    px: 2,
                                    color: '#fff',
                                    textAlign: 'center',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                {mediaType?.toUpperCase() === 'TV' ? '电视节目' : '电影'}
                            </Box>}
                        </Box>
                        <Box>
                            {renderStatueIcon(currentStatus)}
                        </Box>
                    </Box>
                    <ImgWrap
                        referrerPolicy="no-referrer"
                        decoding="async"
                        data-nimg="fill"
                        alt=''
                        src={
                            image
                                ? image
                                : '/static/img/poster_not_found_logo_top.png'
                        }
                    />
                    <Transition
                        show={!image || showDetail}
                        enter="transition transform opacity-0"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition transform opacity-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <ShadowContainer>
                            <ShadowLinkContainer onClick={() => openUrl(extra?.url, extra?.app_url)}>
                                <ShadowTextContainer isHaveBottom={isHaveBottom}>
                                    <Box>
                                        {
                                            year &&
                                            <Typography variant="h5" gutterBottom component="div">{year}</Typography>
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
                                </ShadowTextContainer>
                            </ShadowLinkContainer>
                            <RequestWrapper>
                                {
                                    (currentStatus === undefined || currentStatus === null) && <Button
                                        sx={{width: '100%'}}
                                        variant="contained"
                                        startIcon={<FileDownloadIcon/>}
                                        size="small"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowRequestModal(true);
                                        }}
                                    >
                                        订阅
                                    </Button>
                                }
                                {
                                    currentStatus === 0 && <Stack direction="row" spacing={1} sx={{width: '100%'}}>
                                        <SetFilterButton
                                            status={currentStatus}
                                            sub_id={sub_id}
                                            media_type={mediaType}
                                            setRenewFormData={setRenewFormData}
                                            setShowDownloadMode={setShowDownloadMode}
                                            setShowReNewModal={setShowReNewModal}
                                        />
                                        <DeleteSubButton setShowDeleteModal={setShowDeleteModal}/>
                                    </Stack>
                                }
                                {
                                    currentStatus === 1 &&
                                    <Stack direction="row" spacing={1} sx={{width: '100%'}}>
                                        <SetFilterButton
                                            status={currentStatus}
                                            sub_id={sub_id}
                                            media_type={mediaType}
                                            setRenewFormData={setRenewFormData}
                                            setShowDownloadMode={setShowDownloadMode}
                                            setShowReNewModal={setShowReNewModal}
                                        />
                                        <DeleteSubButton setShowDeleteModal={setShowDeleteModal}/>
                                    </Stack>
                                }
                                {
                                    currentStatus === 2 && <Stack direction="row" spacing={1} sx={{width: '100%'}}>
                                        <SetFilterButton
                                            status={currentStatus}
                                            sub_id={sub_id}
                                            media_type={mediaType}
                                            setRenewFormData={setRenewFormData}
                                            setShowDownloadMode={setShowDownloadMode}
                                            setShowReNewModal={setShowReNewModal}
                                        />
                                        <DeleteSubButton setShowDeleteModal={setShowDeleteModal}/>
                                    </Stack>
                                }
                            </RequestWrapper>
                        </ShadowContainer>
                    </Transition>
                </ImgContainer>

            </CardContainer>
            <BottomTextContainer onClick={() => openUrl(extra?.url, extra?.app_url)}>
                {showBottomTitle ? <h3>{title}</h3> : null}
                {subject ? subject : null}
            </BottomTextContainer>
        </CardWrapper>

    );
}

export default TitleCard;

const ExpandCss = css`
  width: 144px;
  height: 100%;
  @media (min-width: 640px) {
    width: 144px;
  }
  @media (min-width: 768px) {
    width: 176px;
  }
`;
const CanExpandCss = css`
  width: 100%;
`;
const Inset0 = css`
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

const CardWrapper = styled.div`
  ${props => props.canExpand ? CanExpandCss : ExpandCss}
`;

const CardContainer = styled.div`
  position: relative;
  cursor: default;
  border-radius: 12px;
  background-color: rgb(31 41 55);
  background-size: cover;
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;

  width: 100%;
  height: 100%;
  min-height: 176px;
  position: relative;
  cursor: pointer;
  padding-bottom: 150%;
  background-color: rgb(31 41 55);
  border
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

const ImgContainer = styled.div`
  position: absolute;
  ${Inset0};
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const ShadowContainer = styled.div`
  position: absolute;
  ${Inset0};
  overflow: hidden;
  border-radius: 10px;
`;

const ShadowLinkContainer = styled.a`
  position: absolute;
  ${Inset0};
  height: 100%;
  width: 100%;
  cursor: pointer;
  overflow: hidden;
  text-align: left;
  background: linear-gradient(180deg, rgba(45, 55, 72, 0.4) 0%, rgba(45, 55, 72, 0.9) 100%);
`;

const ShadowTextContainer = styled.div`
  color: #fff;
  display: flex;
  height: 100%;
  width: 100%;
  padding-left: 8px;
  padding-right: 8px;
  justify-content: flex-end;
  flex-direction: column;
  padding-bottom: ${({isHaveBottom}) => isHaveBottom ? '44px' : '8px'};
`;

const BottomTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:center;
  h3 {
    cursor: pointer;
    text-align: center;
    width: 100%;
    margin: 2px auto;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;