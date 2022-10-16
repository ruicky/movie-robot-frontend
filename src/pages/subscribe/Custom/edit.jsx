import {Helmet} from "react-helmet-async";
import {
    Box, Breadcrumbs,
    Button,
    Card as MuiCard,
    CardContent,
    Checkbox,
    Divider as MuiDivider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid, Link,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import React, {useContext, useEffect} from "react";
import {spacing} from "@mui/system";
import {useSmartForm} from "@/components/SmartForm";
import TorrentFilterList from "@/components/TorrentFilter/FilterList";
import styled from "styled-components/macro";
import {FilterOptionsContext, FilterOptionsProvider} from "@/contexts/FilterOptionsProvider";
import RenameRuleList from "@/pages/subscribe/components/RenameRuleList";
import {useGetSubCustom, useSubCustom} from "@/utils/subscribe";
import message from "@/utils/message";
import {NavLink, useNavigate, useSearchParams} from "react-router-dom";

const Divider = styled(MuiDivider)(spacing);
const Card = styled(MuiCard)(spacing);
const SavePathSelect = ({smartForm}) => {
    const filterOptions = useContext(FilterOptionsContext);
    const {
        media_path: paths
    } = filterOptions;
    return (<FormControl m={4} fullWidth>
        <Select
            name="save_path"
            value={smartForm.values.save_path}
            onChange={smartForm.handleChange}
        >
            {paths && paths.map((item, index) => (
                <MenuItem key={index} value={item.download_path}>{item.download_path}</MenuItem>
            ))}
        </Select>
        <FormHelperText>
            由此订阅产生的下载，将被提交保存到此路径
        </FormHelperText>
    </FormControl>);
}
const EditCustomSub = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const {mutateAsync: subCustom, isSaving} = useSubCustom();
    const {mutate: getSubCustom, isLoading} = useGetSubCustom();
    const smartForm = useSmartForm({
        initValues: {
            media_type: 'Movie',
            name: '',
            torrent_filter: [],
            rename_rule: [],
            douban_id: '',
            tmdb_id: '',
            save_path: '',
            season_number: 1,
            auto_delete: false
        }
    });
    useEffect(async () => {
        if (searchParams.get("id")) {
            getSubCustom({id: searchParams.get("id")}, {
                onSuccess: resData => {
                    const {code, message: msg, data} = resData;
                    if (code === 0 && data) {
                        if (data.media_type) {
                            smartForm.setFieldValue('media_type', data.media_type);
                        }
                        if (data.name) {
                            smartForm.setFieldValue('name', data.name);
                        }
                        smartForm.setFieldValue('douban_id', data.douban_id);
                        smartForm.setFieldValue('tmdb_id', data.tmdb_id);
                        smartForm.setFieldValue('save_path', data.save_path);
                        smartForm.setFieldValue('season_number', data.season_number);
                        smartForm.setFieldValue('auto_delete', data.auto_delete);
                        if (data.torrent_filter) {
                            let id = 0;
                            const torrentFilter = JSON.parse(data.torrent_filter).map((item) => {
                                id += 1;
                                return {
                                    id,
                                    filter_type: item.type,
                                    filter_data: item.args
                                };
                            });
                            smartForm.setFieldValue('torrent_filter', torrentFilter)
                        }
                        if (data.rename_rule) {
                            let id = 0;
                            const renameRule = JSON.parse(data.rename_rule).map((item) => {
                                id += 1;
                                return {
                                    id,
                                    renameRuleType: item.type,
                                    formData: item.args
                                };
                            });
                            smartForm.setFieldValue('rename_rule', renameRule)
                        }
                    } else {
                        message.error(msg);
                    }
                },
                onError: error => message.error(error)
            })
        }
    }, [searchParams])
    const saveTorrentFilter = (id, val) => {
        const tmp = [...smartForm.values.torrent_filter];
        if (id) {
            let item = tmp.find((item) => item.id === id);
            item.filter_data = val.filter_data;
        } else {
            val['id'] = smartForm.values.torrent_filter.length + 1;
            tmp.push(val);
        }
        smartForm.setFieldValue('torrent_filter', tmp);
    }
    const deleteTorrentFilter = (val) => {
        const tmp = [...smartForm.values.torrent_filter];
        tmp.map((item, i) => {
            if (item.id === val.id) {
                tmp.splice(i, 1);
            }
        });
        smartForm.setFieldValue('torrent_filter', tmp);
    }
    const saveRenameRule = (id, val) => {
        const tmp = [...smartForm.values.rename_rule];
        if (id) {
            let item = tmp.find((item) => item.id === id);
            item.formData = val.formData;
        } else {
            val['id'] = smartForm.values.rename_rule.length + 1;
            tmp.push(val);
        }
        smartForm.setFieldValue('rename_rule', tmp);
    }
    const deleteRenameRule = (val) => {
        const tmp = [...smartForm.values.rename_rule];
        tmp.map((item, i) => {
            if (item.id === val.id) {
                tmp.splice(i, 1);
            }
        });
        smartForm.setFieldValue('rename_rule', tmp);
    }
    const save = () => {
        const {
            media_type,
            name,
            torrent_filter,
            rename_rule,
            douban_id,
            tmdb_id,
            save_path,
            season_number,
            auto_delete
        } = smartForm.values;
        const params = {
            media_type,
            name,
            douban_id,
            tmdb_id,
            save_path,
            season_number,
            auto_delete,
            torrent_filter: torrent_filter.map((item) => {
                return {
                    type: item.filter_type,
                    args: item.filter_data
                }
            }),
            rename_rule: rename_rule.map((item) => {
                return {
                    type: item.renameRuleType,
                    args: item.formData
                }
            })
        };
        params['id'] = searchParams.get("id");
        subCustom(params, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    message.success(msg)
                    navigate("/subscribe/custom-index");
                } else {
                    message.error(msg)
                }
            }
        })
    }
    return (<>
        <Helmet title="设置自定义订阅"/>
        <Typography variant="h3" gutterBottom>
            设置自定义订阅规则
        </Typography>
        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/subscribe/custom-index">
                自定义订阅
            </Link>
            <Typography>规则设置</Typography>
        </Breadcrumbs>
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
                                    name="name"
                                    label="订阅规则名称"
                                    helperText={"区分这个自定义订阅是做什么用的"}
                                    fullWidth
                                    my={3}
                                    value={smartForm.values.name}
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
                            {smartForm.values.media_type === 'TV' && <Grid item xs={12}>
                                <TextField
                                    type="number"
                                    name="season_number"
                                    label="季号"
                                    helperText={"指定剧集是第几季，方便下载完刮削"}
                                    fullWidth
                                    my={3}
                                    value={smartForm.values.season_number}
                                    onChange={smartForm.handleChange}
                                />
                            </Grid>}
                        </Grid>
                    </CardContent>
                </Card>
                <Card mb={6}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            种子过滤条件
                        </Typography>
                        <TorrentFilterList
                            data={smartForm.values.torrent_filter}
                            handleSave={saveTorrentFilter}
                            handleDelete={deleteTorrentFilter}
                        />
                    </CardContent>
                </Card>
                <Card mb={6}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            自动重命名
                        </Typography>
                        <RenameRuleList
                            data={smartForm.values.rename_rule}
                            handleSave={saveRenameRule}
                            handleDelete={deleteRenameRule}
                        />
                    </CardContent>
                </Card>
                <Card mb={6}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            下载设置
                        </Typography>
                        <SavePathSelect smartForm={smartForm}/>
                        <FormControlLabel
                            control={<Checkbox
                                name="auto_delete"
                                checked={smartForm.values.auto_delete}
                                onChange={smartForm.handleChange}
                            />}
                            label="下载完成后对影视库已经存在的影片做替换"
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
                    onClick={save}
                >
                    保存自定义订阅规则
                </Button>
            </Box>
        </FilterOptionsProvider>
    </>);
}
export default EditCustomSub;