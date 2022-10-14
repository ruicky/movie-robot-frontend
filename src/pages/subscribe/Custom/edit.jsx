import {Helmet} from "react-helmet-async";
import {
    Box, Button,
    Card as MuiCard,
    CardContent, Checkbox,
    Divider as MuiDivider, FormControlLabel,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import React from "react";
import {spacing} from "@mui/system";
import {useSmartForm} from "@/components/SmartForm";
import TorrentFilterList from "@/components/TorrentFilter/FilterList";
import styled from "styled-components/macro";
import {RenameRuleList} from "@/pages/subscribe/components/RenameRuleList";

const Divider = styled(MuiDivider)(spacing);
const Card = styled(MuiCard)(spacing);
const EditCustomSub = () => {
    const smartForm = useSmartForm({
        initValues: {
            generate_nfo: true
        }
    });
    return (<>
        <Helmet title="设置自定义订阅"/>
        <Typography variant="h3" gutterBottom>
            设置自定义订阅规则
        </Typography>
        <Divider my={4}/>
        <Box component="form" noValidate mt={4}>
            <Card mb={6}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        订阅信息
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={3} md={2}>
                            <Select
                                name="type"
                                value={"Movie"}
                                fullWidth
                            >
                                <MenuItem value="Movie">电影</MenuItem>
                                <MenuItem value="TV">剧集</MenuItem>
                                <MenuItem value="Other">其他</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={9} md={10}>
                            <TextField
                                type="text"
                                name="customSubName"
                                label="订阅规则名称"
                                helperText={"区分这个自定义订阅是做什么用的"}
                                fullWidth
                                my={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                name="doubanId"
                                label="豆瓣影片信息"
                                helperText={"这个订阅规则关联的豆瓣影片编号（编号或直接复制豆瓣影片的URL）"}
                                fullWidth
                                my={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                name="tmdbId"
                                label="TheMovieDB影片信息"
                                helperText={"这个订阅规则关联的TMDB影片编号（编号或直接复制TMDB影片的URL）"}
                                fullWidth
                                my={3}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card mb={6}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        种子过滤条件
                    </Typography>
                    <TorrentFilterList/>
                </CardContent>
            </Card>
            <Card mb={6}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        自动重命名
                    </Typography>
                    <RenameRuleList/>
                </CardContent>
            </Card>
            <Card mb={6}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        其他设置
                    </Typography>
                    <FormControlLabel
                        control={<Checkbox
                            name="deepDelete"
                        />}
                        label="分享这个规则给其他订阅此影片的用户"
                    />
                </CardContent>
            </Card>
        </Box>
        <Box>
            <Button
                mr={2}
                size="medium"
                variant="contained"
                color="success"
                fullWidth
            >
                保存自定义订阅规则
            </Button>
        </Box>
    </>);
}
export default EditCustomSub;