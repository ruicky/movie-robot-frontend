import React, {useCallback, useEffect, useState} from "react";
import {useIsTouch} from "@/hooks/useIsTouch";
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
} from "@mui/icons-material";
import Transition from "@/components/Transition";
import {blue, cyan, green, grey, indigo, yellow} from "@mui/material/colors";
import SubscribeDialog from "../SubscribeDialog";
import DeleteConfirmDialog from "../DeleteConfirmDialog";
import ReNewDialog from "@/pages/subscribe/components/ReNewDialog";
import {jumpUrl} from "@/utils/urlUtils";
import LinesEllipsis from "react-lines-ellipsis";
import {getSub, useApprovedSubscribe, useRefuseSubscribe} from "@/utils/subscribe";
import MultipleChoice from "./MultipleChoice";
import ChoiceChecked from "@/pages/subscribe/components/TitleCard/ChoiceChecked";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import message from "@/utils/message";

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
        case "待审批":
            icon = <AccessTimeFilledIcon htmlColor={indigo[500]}/>;
            break;
        case 0:
            icon = <NotificationsIcon htmlColor={yellow[500]}/>;
            break;
        case 1:
            icon = <CheckCircleIcon htmlColor={green[400]}/>;
            break;
        case 2:
            icon = <Autorenew htmlColor={blue[500]}/>;
            break;
    }
    return icon;
};
const DeleteSubButton = ({setShowDeleteModal}) => {
    return (
        <Button
            color="error"
            variant="contained"
            startIcon={<DeleteForeverIcon/>}
            size="small"
            sx={{width: "100%"}}
            onClick={(e) => {
                e.preventDefault();
                setShowDeleteModal(true);
            }}
        >
            删除
        </Button>
    );
};
const ApprovalButtonGroup = ({subId, onApproved = null, onRefuse = null}) => {
    return (<Stack direction="row" spacing={1} sx={{width: '100%'}}>
        <Button
            sx={{width: "100%"}}
            variant="contained"
            startIcon={<CheckIcon/>}
            size="small"
            onClick={(e) => {
                e.preventDefault();
                if (onApproved) {
                    onApproved(subId);
                }
            }}
            color="success"
        >
            同意
        </Button>
        <Button
            sx={{width: "100%"}}
            variant="contained"
            startIcon={<ClearIcon/>}
            size="small"
            onClick={(e) => {
                e.preventDefault();
                if (onRefuse) {
                    onRefuse(subId);
                }
            }}
            color="error"
        >
            拒绝
        </Button>
    </Stack>);
}
const SetFilterButton = ({
                             status,
                             sub_id,
                             media_type,
                             setRenewFormData,
                             setShowReNewModal,
                             setShowDownloadMode,
                         }) => {
    const resetFilter = async () => {
        const data = await getSub(sub_id);
        const values = data?.filter_config ? JSON.parse(data?.filter_config) : null;
        setRenewFormData(values);
        setShowReNewModal(true);
    };
    const reVersion = status === 1;
    return (
        <Button
            color={"success"}
            sx={{width: "100%"}}
            variant="contained"
            startIcon={reVersion ? <Autorenew/> : <FilterList/>}
            size="small"
            onClick={async (e) => {
                e.preventDefault();
                setShowDownloadMode(
                    !reVersion && media_type === "Movie" && status !== 2
                );
                await resetFilter();
            }}
        >
            {reVersion ? "洗版" : "过滤"}
        </Button>
    );
};
const TitleCard = ({
                       sub_id,
                       id,
                       mediaType,
                       year,
                       subject,
                       title,
                       summary,
                       image,
                       status,
                       url,
                       canExpand = false,
                       showBottomTitle = true,
                       haveMultiSelectionMode = false, // 是否有多选模式
                       extra,
                       season,
                       showSubLogs
                   }) => {
    const isTouch = useIsTouch();
    const [showDetail, setShowDetail] = useState(false);
    const [showDownloadMode, setShowDownloadMode] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showReNewModal, setShowReNewModal] = useState(false);
    const [renewFormData, setRenewFormData] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(status);
    const {mutate: approved, isLoading: isApproved} = useApprovedSubscribe();
    const {mutate: refuse, isLoading: isRefuse} = useRefuseSubscribe();
    const onApproved = (subId) => {
        approved({sub_id: subId}, {
            onSuccess: resData => {
                const {code, message: msg} = resData;
                if (code === 0) {
                    message.success(msg);
                    setCurrentStatus(0);
                } else {
                    message.error(msg);
                }
            },
            onError: error => message.error(error)
        });
    }
    const onRefuse = (subId) => {
        refuse({sub_id: subId}, {
            onSuccess: resData => {
                const {code, message: msg} = resData;
                if (code === 0) {
                    message.success(msg);
                    setCurrentStatus(null);
                } else {
                    message.error(msg);
                }
            },
            onError: error => message.error(error)
        });
    }
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
        jumpUrl(httpUrl, appUrl);
    };
    return (
        <CardWrapper canExpand={canExpand}>
            {showRequestModal && <SubscribeDialog
                open={showRequestModal}
                onComplete={requestComplete}
                handleClose={() => setShowRequestModal(false)}
                data={{id: id, name: title, year, season}}
            />}
            <ReNewDialog
                showDownloadMode={showDownloadMode}
                open={showReNewModal}
                onComplete={reNewComplete}
                renewFormData={renewFormData}
                handleClose={() => setShowReNewModal(false)}
                data={{id: id, name: title, year, sub_id: sub_id}}
            />
            <DeleteConfirmDialog
                open={showDeleteModal}
                onComplete={deleteComplete}
                handleClose={() => setShowDeleteModal(false)}
                data={{id: id, name: title, year, sub_id: sub_id, season}}
            />
            <CardContainer
                className={`${showDetail ? "scale-105" : "scale-100"}`}
                onMouseEnter={() => {
                    if (!isTouch) {
                        setShowDetail(true);
                    }
                }}
                onMouseLeave={() => setShowDetail(false)}
                onClick={() => setShowDetail(true)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setShowDetail(true);
                    }
                }}
            >
                <ChoiceChecked id={id}>
                    <ImgContainer>
                        <Box
                            sx={{
                                position: "absolute",
                                left: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                p: 2,
                                boxShadow: 1,
                                cursor: "default",
                                width: "100%",
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor:
                                        mediaType?.toUpperCase() === "MOVIE"
                                            ? cyan[500]
                                            : grey[800],
                                    borderRadius: "9999px",
                                }}
                            >
                                {mediaType && (
                                    <Box
                                        sx={{
                                            px: 2,
                                            color: "#fff",
                                            textAlign: "center",
                                            fontWeight: 500,
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        {mediaType?.toUpperCase() === "TV" ? "电视节目" : "电影"}
                                    </Box>
                                )}
                            </Box>
                            <Box>{renderStatueIcon(currentStatus)}</Box>
                        </Box>
                        <ImgWrap
                            referrerPolicy="no-referrer"
                            decoding="async"
                            data-nimg="fill"
                            alt=""
                            src={image ? image : "/static/img/poster_not_found_logo_top.png"}
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
                            <ShadowContainer>
                                <ShadowLinkContainer>
                                    {/*多选组件*/}
                                    {haveMultiSelectionMode && <MultipleChoice id={id}/>}
                                    <ShadowTextContainer
                                        bottom={(currentStatus || currentStatus === 0) && showSubLogs ? "80px" : "44px"}
                                        onClick={() => openUrl(extra?.url, extra?.app_url)}
                                    >
                                        <Box>
                                            {year && (
                                                <Typography variant="h5" gutterBottom component="div">
                                                    {year}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                WebkitLineClamp: 3,
                                                display: "-webkit-box",
                                                overflow: "hidden",
                                                WebkitBoxOrient: "vertical",
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {title}
                                        </Typography>
                                        {currentStatus === 3 && <Typography variant="subtitle2">
                                            等待批准后开始下载。
                                        </Typography>}
                                    </ShadowTextContainer>
                                </ShadowLinkContainer>
                                <RequestWrapper>
                                    {(currentStatus === undefined || currentStatus === null) && (
                                        <Button
                                            sx={{width: "100%"}}
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
                                    )}
                                    {
                                        currentStatus === 3 &&
                                        <ApprovalButtonGroup subId={sub_id} onApproved={onApproved}
                                                             onRefuse={onRefuse}/>
                                    }
                                    {[0, 1, 2].includes(currentStatus) && showSubLogs && <Button
                                        color="info"
                                        sx={{width: "100%", marginBottom: 1}}
                                        variant="contained"
                                        size="small"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            showSubLogs({subId: sub_id, title, year});
                                        }}
                                    >
                                        全息日志
                                    </Button>}
                                    {
                                        [0, 1, 2].includes(currentStatus) &&
                                        <Stack direction="row" spacing={1} sx={{width: '100%'}}>
                                            {(!season || season.length === 0) && <SetFilterButton
                                                status={currentStatus}
                                                sub_id={sub_id}
                                                media_type={mediaType}
                                                setRenewFormData={setRenewFormData}
                                                setShowDownloadMode={setShowDownloadMode}
                                                setShowReNewModal={setShowReNewModal}
                                            />}
                                            <DeleteSubButton setShowDeleteModal={setShowDeleteModal}/>
                                        </Stack>
                                    }
                                </RequestWrapper>
                            </ShadowContainer>
                        </Transition>
                    </ImgContainer>
                </ChoiceChecked>
            </CardContainer>
            <BottomTextContainer onClick={() => openUrl(extra?.url, extra?.app_url)}>
                {showBottomTitle ? (
                    <h3>
                        <LinesEllipsis
                            text={`${title}${year ? `(${year})` : ''}`}
                            maxLine={1}
                            style={{height: "24px"}}
                        />
                    </h3>
                ) : null}
                {subject ? subject : null}
            </BottomTextContainer>
        </CardWrapper>
    );
};

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
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const CardWrapper = styled.div`
  ${(props) => (props.canExpand ? CanExpandCss : ExpandCss)}
`;

const CardContainer = styled.div`
  border-radius: 12px;
  background-size: cover;
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;

  width: 100%;
  height: 100%;
  min-height: 176px;
  position: relative;
  cursor: pointer;
  padding-bottom: 150%;
  background-color: rgb(31 41 55);
`;

const RequestWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
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
  background: linear-gradient(
    180deg,
    rgba(45, 55, 72, 0.4) 0%,
    rgba(45, 55, 72, 0.9) 100%
  );
`;

const ShadowTextContainer = styled.div`
  z-index: 100;
  color: #fff;
  display: flex;
  height: 100%;
  width: 100%;
  padding-top: 20px;
  padding-left: 8px;
  padding-right: 8px;
  justify-content: flex-end;
  flex-direction: column;
  padding-bottom: ${({bottom}) => bottom};
`;

const BottomTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h3 {
    cursor: pointer;
    text-align: center;
    width: 100%;
    margin: 2px auto;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
