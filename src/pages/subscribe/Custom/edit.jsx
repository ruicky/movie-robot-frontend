import {Helmet} from "react-helmet-async";
import {
    Box,
    Button,
    Card as MuiCard,
    CardContent,
    Checkbox,
    Divider as MuiDivider,
    FormControlLabel,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import {spacing} from "@mui/system";
import {useSmartForm} from "@/components/SmartForm";
import TorrentFilterList from "@/components/TorrentFilter/FilterList";
import styled from "styled-components/macro";
import {RenameRuleList} from "@/pages/subscribe/components/RenameRuleList";
import {FilterOptionsProvider} from "@/contexts/FilterOptionsProvider";

const Divider = styled(MuiDivider)(spacing);
const Card = styled(MuiCard)(spacing);
const EditCustomSub = () => {
    const [torrentFilterList, setTorrentFilterList] = useState([]);
    const smartForm = useSmartForm({
        initValues: {
            media_type: 'Movie',
            custom_sub_name: ''
        }
    });
    const saveTorrentFilter = (id, val) => {
        const tmp = [...torrentFilterList];
        if (id) {
            let item = tmp.find((item) => item.id === id);
            item.filter_data = val.filter_data;
        } else {
            val['id'] = torrentFilterList.length + 1;
            tmp.push(val);
        }
        setTorrentFilterList(tmp);
    }
    const deleteTorrentFilter = (val) => {
        const tmp = [...torrentFilterList];
        tmp.map((item, i) => {
            if (item.id === val.id) {
                tmp.splice(i, 1);
            }
        });
        setTorrentFilterList(tmp);
    }
    return (<>
        <Helmet title="设置自定义订阅"/>
        <Typography variant="h3" gutterBottom>
            设置自定义订阅规则
        </Typography>
        <Divider my={4}/>
        <FilterOptionsProvider>
            <Box component="form" noValidate mt={4}>
                <Card mb={6}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            订阅信息
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid item xs={3} md={2}>
                                <Select
                                    name="media_type"
                                    value={smartForm.values.media_type}
                                    onChange={smartForm.handleChange}
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
                                    name="custom_sub_name"
                                    label="订阅规则名称"
                                    helperText={"区分这个自定义订阅是做什么用的"}
                                    fullWidth
                                    my={3}
                                    value={smartForm.values.custom_sub_name}
                                    onChange={smartForm.handleChange}
                                />
                            </Grid>
                            {smartForm.values.media_type !== 'Other' && (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            type="text"
                                            name="douban_id"
                                            label="豆瓣影片信息"
                                            helperText={"这个订阅规则关联的豆瓣影片编号（编号或直接复制豆瓣影片的URL）"}
                                            fullWidth
                                            my={3}
                                            value={smartForm.values.douban_id}
                                            onChange={smartForm.handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            type="text"
                                            name="tmdb_id"
                                            label="TheMovieDB影片信息"
                                            helperText={"这个订阅规则关联的TMDB影片编号（编号或直接复制TMDB影片的URL）"}
                                            fullWidth
                                            my={3}
                                            value={smartForm.values.tmdb_id}
                                            onChange={smartForm.handleChange}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </CardContent>
                </Card>
                <Card mb={6}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            种子过滤条件
                        </Typography>
                        <TorrentFilterList data={torrentFilterList} handleSave={saveTorrentFilter}
                                           handleDelete={deleteTorrentFilter}/>
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
        </FilterOptionsProvider>
    </>);
}
export default EditCustomSub;