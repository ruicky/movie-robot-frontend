import {Helmet} from "react-helmet-async";
import {
    Box,
    Card,
    CardContent,
    Divider,
    FormControl,
    Grid,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import PathSelectDialog from "@/components/PathSelectDialog";
import MediaTable from "@/pages/media/Link/MeidaTable";
import {useGetMediaLibrary, useGetMediaLinkStatus} from "@/api/MediaServerApi";
import {useInterval} from "@/utils/hooks";
import message from "@/utils/message";

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box sx={{width: '100%', mr: 1}}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{minWidth: 180}}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}% （成功${props.success}/失败${props.failed}）`}</Typography>
            </Box>
        </Box>
    );
}

function Index() {
    const [mediaType, setMediaType] = useState('Movie');
    const [sourcePath, setSourcePath] = useState('');
    const [linkPath, setLinkPath] = useState('');
    const [progress, setProgress] = useState({
        value: 0,
        success: 0,
        failed: 0
    });
    const [linkStart, setLinkStart] = useState(false);
    const [rows, setRows] = useState([]);
    const [tips, setTips] = useState("");
    const {mutateAsync: getMediaLibrary, isLoading} = useGetMediaLibrary();

    const {
        data: mediaLinkStatusData,
        isLoading: isGetMediaLinkStatus,
        refetch: refetchMediaLinkStatus
    } = useGetMediaLinkStatus();
    const fetchLinkStatus = () => {
        if (linkStart) {
            refetchMediaLinkStatus();
        }
    }
    useInterval(fetchLinkStatus, 1500)
    const onLinkStart = (paths) => {
        setLinkStart(true);
    }
    const fetchGetMediaLibrary = (path) => {
        getMediaLibrary({path}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    setRows((data || []).map((item) => {
                        return {
                            name: item.name,
                            file_type_desc: item.file_type_desc,
                            status: item.status,
                            release_date: item?.recognition_result?.metadata ? item.recognition_result.metadata.release_date : "未知",
                            media_name: item?.recognition_result?.metadata ? item.recognition_result.metadata.name : "未知",
                            media_type: item?.recognition_result?.metadata ? item.recognition_result.metadata.media_type : "未知",
                            path: item.path,
                            err_msg: item?.recognition_result?.err_msg,
                            is_disc:item?.is_disc,
                            disc_type:item?.disc_type
                        }
                    }));
                } else {
                    message.error(msg);
                }
            },
            onError: error => message.error(error)
        });
    }
    useEffect(() => {
        if (sourcePath) {
            fetchGetMediaLibrary(sourcePath);
        }
    }, [sourcePath])
    useEffect(() => {
        if (mediaLinkStatusData?.data && (mediaLinkStatusData.data.root_path === sourcePath || !sourcePath)) {
            setLinkStart(mediaLinkStatusData.data.running);
            if (!sourcePath && !linkStart) {
                setSourcePath(mediaLinkStatusData.data.root_path);
            }
            if (!linkPath && !linkStart) {
                setLinkPath(mediaLinkStatusData.data.link_path);
            }
            if (!mediaType && !linkStart) {
                setMediaType(mediaLinkStatusData.data.media_type);
            }
            if (mediaLinkStatusData.data.progress === 100) {
                setLinkStart(false);
                let errMsg = '';
                if (mediaLinkStatusData.data.failed_count) {
                    errMsg = "（鼠标滑动到错误状态，可以看到失败原因）";
                }
                setTips(`${sourcePath}已经整理完毕 成功：${mediaLinkStatusData.data.success_count} 识别失败：${mediaLinkStatusData.data.failed_count}${errMsg}`);
                fetchGetMediaLibrary(sourcePath);
            } else {
                setProgress({
                    value: mediaLinkStatusData.data.progress,
                    success: mediaLinkStatusData.data.success_count,
                    failed: mediaLinkStatusData.data.failed_count
                });
            }
        } else {
            setLinkStart(false);
            setTips("选择媒体路径后，可以加载该路径下待处理的影视资源。通过选个单个或全选资源，作出整理操作。");
        }
    }, [sourcePath, mediaLinkStatusData])
    return (
        <>
            <Helmet title="本地资源整理"/>
            <Typography variant="h3" gutterBottom>
                本地资源整理
            </Typography>
            <Divider my={4}/>
            <Grid container my={2} spacing={1}>
                <Grid item md={1} xs={3}>
                    <FormControl fullWidth>
                        <Select
                            name="type"
                            value={mediaType}
                            displayEmpty
                            onChange={(e) => setMediaType(e.target.value)}
                            disabled={linkStart}
                        >
                            <MenuItem value="Movie">电影</MenuItem>
                            <MenuItem value="TV">剧集</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={5.5} xs={9}>
                    <PathSelectDialog
                        title="点击选择媒体路径" placeholder="点击选择媒体路径"
                        defaultSelected={sourcePath}
                        onChange={(value) => {
                            setTips("选择媒体路径后，可以加载该路径下待处理的影视资源。通过选个单个或全选资源，作出整理操作。");
                            setSourcePath(value);
                        }}
                        disabled={linkStart}
                    />
                </Grid>
                <Grid item md={5.5} xs={12}>
                    <PathSelectDialog
                        title="点击选择整理后路径" placeholder="点击选择整理后路径"
                        defaultSelected={linkPath}
                        onChange={(value) => setLinkPath(value)}
                        disabled={linkStart}
                    />
                </Grid>
            </Grid>
            <Card mb={6}>
                <CardContent pb={1}>
                    <Typography variant="h6" gutterBottom>
                        {mediaType === "Movie" ? "电影" : "剧集"}{linkStart ? "整理中" : "待整理"}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        {linkStart ? <LinearProgressWithLabel variant="determinate"
                                                              value={progress.value} success={progress.success}
                                                              failed={progress.failed}/> : tips}
                    </Typography>
                </CardContent>
                <Paper>
                    <MediaTable rows={rows} isLoading={isLoading} path={sourcePath} linkPath={linkPath}
                                mediaType={mediaType}
                                onLinkStart={onLinkStart}
                                disabled={linkStart}
                    />
                </Paper>
            </Card>
        </>
    );
}

export default Index;