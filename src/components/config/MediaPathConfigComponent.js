import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components/macro";
import axios from "../../utils/request";

import {
    Alert as MuiAlert,
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    FormHelperText,
    MenuItem,
    Select,
    TextField as MuiTextField,
    Typography
} from "@mui/material";
import {spacing} from "@mui/system";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;

function MediaPathConfigComponent({isInit}) {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [paths, setPaths] = useState([{type: "movie", file_process_mode: "link"}]);
    const saveConfig = async (params) => {
        setNextButtonDisabled(true);
        setErrorMessage(undefined);
        let hasError = false;
        let tmpPaths = [...paths];
        for (let i = 0; i < params.length; i++) {
            let v = params[i];
            let item = {...tmpPaths[i]};
            if (v.download_path === undefined || v.download_path === "" || item.downloadPathError !== undefined) {
                item.downloadPathError = item.downloadPathError || "路径不能为空";
                hasError = true;
            }
            if (v.source_dir === undefined || v.source_dir === "" || item.sourceDirError !== undefined) {
                item.sourceDirError = item.sourceDirError || "路径不能为空";
                hasError = true;
            }
            if (v.target_dir === undefined || v.target_dir === "" || item.targetDirError !== undefined) {
                item.targetDirError = item.targetDirError || "路径不能为空";
                hasError = true;
            }
            tmpPaths[i] = item;
        }
        setPaths(tmpPaths);
        if (hasError) {
            setNextButtonDisabled(false);
            return;
        }
        try {
            const res = await axios.post("/api/config/save_media_path", params);
            const {code, message, data} = res;
            if (code === undefined || code === 1) {
                throw new Error(message);
            }
            if (isInit) {
                navigate(data.next);
            } else {
                setMessage(message);
            }
        } catch (error) {
            const message = error.message || "配置出错啦";
            setErrorMessage(message);
        }
        setNextButtonDisabled(false);
    };
    const handleOnChange = (index, e) => {
        let tmpPaths = [...paths];
        let item = {...tmpPaths[index]};
        item[e.target.name] = e.target.value;
        tmpPaths[index] = item;
        setPaths(tmpPaths);
    };

    const handleOnBlur = async (index, e) => {
        let tmpPaths = [...paths];
        let item = {...tmpPaths[index]};
        let errorMsg = undefined;
        if (e.target.value === "") {
            errorMsg = "路径不能为空";
        } else if (e.target.name !== 'download_path') {
            const res = await axios.get("/api/config/check_path", {params: {path: e.target.value}});
            const {code, message, data} = res;
            if (code === undefined || code === 1) {
                errorMsg = message;
            }
        }
        switch (e.target.name) {
            case "download_path":
                item.downloadPathError = errorMsg;
                break;
            case "source_dir":
                item.sourceDirError = errorMsg;
                break;
            case "target_dir":
                item.targetDirError = errorMsg;
                break;
            default:
                break
        }

        tmpPaths[index] = item;
        setPaths(tmpPaths);
    };
    useEffect(async () => {
        axios.get("/api/config/get_media_path").then((res) => {
            const data = res.data;
            if (data !== undefined) {
                setPaths(data);
            }
        });
    }, []);
    return (<Card>
        {errorMessage && (<Alert mt={2} mb={1} severity="warning">
            {errorMessage}
        </Alert>)}
        {message && (<Alert severity="success" my={3}>
            {message}
        </Alert>)}
        {paths && paths.length > 0 ? (paths.map((p, i) => (<Card mb={6} key={i}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    路径{i + 1}<Button onClick={() => {
                    const temp = [...paths];
                    temp.splice(i, 1);
                    setPaths(temp);
                }}>删除</Button>
                </Typography>
                <FormControl m={4} fullWidth>
                    <Select
                        name="type"
                        value={p.type}
                        displayEmpty
                        onChange={(e) => handleOnChange(i, e)}
                    >
                        <MenuItem value="movie">电影</MenuItem>
                        <MenuItem value="tv">剧集</MenuItem>
                    </Select>
                    <FormHelperText>路径存放的内容类型</FormHelperText>
                </FormControl>
                <TextField
                    name="download_path"
                    value={p.download_path}
                    label="下载保存路径"
                    fullWidth
                    variant="outlined"
                    error={Boolean(p.downloadPathError !== undefined && p.downloadPathError !== "")}
                    helperText={(p.downloadPathError !== undefined && p.downloadPathError !== "" && p.downloadPathError) || "种子提交到下载工具后，文件的保存路径"}
                    my={2}
                    onChange={(e) => handleOnChange(i, e)}
                    onBlur={(e) => handleOnBlur(i, e)}
                />
                <TextField
                    name="source_dir"
                    label="下载路径装载到容器的路径"
                    fullWidth
                    variant="outlined"
                    error={Boolean(p.sourceDirError !== undefined && p.sourceDirError !== "")}
                    helperText={(p.sourceDirError !== undefined && p.sourceDirError !== "" && p.sourceDirError) || "下载文件保存的路径，装载给容器的存储空间路径"}
                    my={2}
                    value={p.source_dir}
                    onChange={(e) => handleOnChange(i, e)}
                    onBlur={(e) => handleOnBlur(i, e)}
                />
                <TextField
                    name="target_dir"
                    label="下载完整理的目标路径"
                    fullWidth
                    variant="outlined"
                    error={Boolean(p.targetDirError !== undefined && p.targetDirError !== "")}
                    helperText={(p.targetDirError !== undefined && p.targetDirError !== "" && p.targetDirError) || "识别到影视信息的资源，会以名称(上映年份)保存在此路径"}
                    my={2}
                    value={p.target_dir}
                    onChange={(e) => handleOnChange(i, e)}
                    onBlur={(e) => handleOnBlur(i, e)}
                />
                <FormControl m={4} fullWidth>
                    <Select
                        name="file_process_mode"
                        value={p.file_process_mode}
                        displayEmpty
                        onChange={(e) => handleOnChange(i, e)}
                    >
                        <MenuItem value="link">硬链接到目标路径</MenuItem>
                        <MenuItem value="copy">复制到目标路径</MenuItem>
                    </Select>
                    <FormHelperText>{p.file_process_mode === "link" ? "对同一个存储区块做新的引用，不占额外空间，不影响源文件做种" : "将源文件直接复制到目标路径，产生额外的存储空间"}</FormHelperText>
                </FormControl>
            </CardContent>
        </Card>))) : null}
        <CardActions>
            <Button size="small" color="primary" onClick={() => {
                setPaths([...paths, {type: "movie", file_process_mode: "link"}]);
            }}>
                加一个路径
            </Button>
        </CardActions>
        <Centered>
            {isInit && (<Button sx={{mr: 2}}
                                size="medium"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    navigate("/setup/download-client");
                                }}
            >
                返回下载工具设置
            </Button>)}
            <Button
                mr={2}
                size="medium"
                variant="contained"
                color="primary"
                onClick={() => {
                    saveConfig(paths);
                }}
                disabled={nextButtonDisabled}
                fullWidth={!isInit}
            >
                {isInit ? "保存进入下一步" : "保存"}
            </Button>
        </Centered>
    </Card>);
}

export default MediaPathConfigComponent;
