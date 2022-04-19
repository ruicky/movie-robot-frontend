import {Helmet} from "react-helmet-async";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    FormHelperText,
    MenuItem,
    Paper,
    Select,
    Slider,
    TextField,
    Typography
} from "@mui/material";
import React from "react";
import styled from "styled-components/macro";

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;
const marks = [
    {
        value: 0,
        label: '0%',
    },
    {
        value: 100,
        label: '100%',
    },
];

function ScoreRuleConfig() {
    return (
        <React.Fragment>
            <Wrapper>
                <Helmet title="设置选种规则 - 进阶设置"/>
                <Card>
                    <CardContent>
                        <Typography component="h1" variant="h4" align="center" gutterBottom>
                            设置选种规则
                        </Typography>
                        <Typography component="h2" variant="body1" align="center">
                            选种的规则，可以应用于搜索和智能下载。
                        </Typography>
                        <FormControl m={4} fullWidth>
                            <Select
                                name="type"
                                displayEmpty
                            >
                                <MenuItem value="collection">collection</MenuItem>
                                <MenuItem value="compress">compress</MenuItem>
                                <MenuItem value="compact">compact</MenuItem>
                            </Select>
                            <FormHelperText>策略的名称，可以复制配置目录rules中的文件，实现新增。</FormHelperText>
                        </FormControl>
                        <TextField
                            type="text"
                            name="name_keywords"
                            label="自定义关键字"
                            my={3}
                            helperText={"种子名或标题中命中任何一个关键字，则名称分数变高。"}
                            fullWidth
                        />
                        <Box sx={{m: 3}}>
                            <Typography gutterBottom>名称分数权重</Typography>
                            <FormControl m={4} fullWidth>
                                <Slider size="small" defaultValue={50} aria-label="Default" valueLabelDisplay="auto"
                                        marks={marks}/>
                                <FormHelperText>种子名和副标题中是否含有电影相关名称信息，以及含有你设定的关键字信息，会决定该项数据得分。</FormHelperText>
                            </FormControl>
                        </Box>
                        <Box sx={{m: 3}}>
                            <Typography gutterBottom>类型分数权重</Typography>
                            <FormControl m={4} fullWidth>
                                <Slider size="small" defaultValue={50} aria-label="Default" valueLabelDisplay="auto"
                                        marks={marks}/>
                                <FormHelperText>类型是指种子的存储介质、分辨率、编码类型、压缩格式等包含在种子名中的信息。系统内置一套分数评价体系。</FormHelperText>
                            </FormControl>
                        </Box>
                        <Box sx={{m: 3}}>
                            <Typography gutterBottom>做种人数权重</Typography>
                            <FormControl m={4} fullWidth>
                                <Slider size="small" defaultValue={50} aria-label="Default" valueLabelDisplay="auto"
                                        marks={marks}/>
                                <FormHelperText>做种人数越多，得分越高。</FormHelperText>
                            </FormControl>
                        </Box>
                        <Box sx={{m: 3}}>
                            <Typography gutterBottom>下载完成人数权重</Typography>
                            <FormControl m={4} fullWidth>
                                <Slider size="small" defaultValue={50} aria-label="Default" valueLabelDisplay="auto"
                                        marks={marks}/>
                                <FormHelperText>下载完成的人数越多，得分越高。</FormHelperText>
                            </FormControl>
                        </Box>
                        <Box sx={{m: 3}}>
                            <Typography gutterBottom>字幕分数权重</Typography>
                            <FormControl m={4} fullWidth>
                                <Slider size="small" defaultValue={50} aria-label="Default" valueLabelDisplay="auto"
                                        marks={marks}/>
                                <FormHelperText>命中字幕关键字数量越多，得分越高。</FormHelperText>
                            </FormControl>
                        </Box>
                        <Box sx={{m: 3}}>
                            <Typography gutterBottom>免费资源分数权重</Typography>
                            <FormControl m={4} fullWidth>
                                <Slider size="small" defaultValue={50} aria-label="Default" valueLabelDisplay="auto"
                                        marks={marks}/>
                                <FormHelperText>种子免费剩余时间越长，得分越高。</FormHelperText>
                            </FormControl>
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Button
                            mr={2}
                            size="medium"
                            variant="contained"
                            color="primary"
                        >
                            保存设置
                        </Button>
                    </CardActions>
                </Card>
            </Wrapper>
        </React.Fragment>
    )
}

export default ScoreRuleConfig