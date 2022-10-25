import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import {
    useAddSubscribe,
    useCancelHateSubRule,
    useCancelLikeSubRule,
    useGetSubRuleByDoubanId,
    useHateSubRule, useLikeSubRule
} from '@/utils/subscribe';
import message from "@/utils/message";
import FilterForm from "@/components/Selectors/FilterForm";
import {FilterOptionsContext} from "@/contexts/FilterOptionsProvider";
import SeasonSelect from "@/pages/subscribe/components/SeasonSelect";
import {ShareRuleList} from "@/pages/subscribe/components/ShareRuleList";
import {useNavigate} from "react-router-dom";


const SubscribeDialog = ({open, handleClose, data, onComplete}) => {
    const navigate = useNavigate();
    const filterOptionsContextData = useContext(FilterOptionsContext)
    const myRef = useRef(null);
    const [filterName, setFilterName] = useState();
    const [doubanId, setDoubanId] = useState(null);
    const [seasonDoubanId, setSeasonDoubanId] = useState([]);
    const [showFilterForm, setShowFilterForm] = useState(false);
    const {name, year} = data;
    const {mutateAsync: addSubscribe, isLoading} = useAddSubscribe();
    const {mutateAsync: getSubRule} = useGetSubRuleByDoubanId();
    const [ruleList, setRuleList] = useState(null);
    const {mutate: like} = useLikeSubRule();
    const {mutate: cancellike} = useCancelLikeSubRule();
    const {mutate: hate} = useHateSubRule();
    const {mutate: cancelHate} = useCancelHateSubRule();
    useEffect(() => {
        if (!data) {
            return;
        }
        if (data?.season && data.season.length > 0) {
            setSeasonDoubanId([data.season[data.season.length - 1].doubanId]);
        } else {
            setSeasonDoubanId([]);
        }
        if (data.sub_id) {
            setDoubanId(data.sub_id);
        } else {
            setDoubanId(data.id);
        }
    }, [data]);
    useEffect(() => {
        if (seasonDoubanId && seasonDoubanId.length > 0) {
            return;
        }
        if (doubanId) {
            getSubRule({douban_id: doubanId}, {
                onSuccess: resData => {
                    const {code, message: msg, data} = resData;
                    if (code === 0) {
                        setRuleList(data);
                    }
                }
            });
        }
    }, [doubanId, seasonDoubanId]);
    const onChange = (e) => {
        setFilterName(e.target.value)
        if (e.target.value === 'system:newFilter') {
            setShowFilterForm(true)
        } else {
            setShowFilterForm(false)
        }
    }
    const handleSubmit = async () => {
        let filterConfig;
        if (filterName && filterName === 'system:newFilter') {
            await myRef.current.onSubmit()
            filterConfig = await myRef.current.getVal()
        }
        addSubscribe({id: doubanId, filter_name: filterName, filter_config: filterConfig, season_ids: seasonDoubanId}, {
            onSuccess: resData => {
                const {code, message: msg} = resData;
                if (code === 0) {
                    message.success(msg);
                    if (onComplete) {
                        onComplete(0);
                    }
                    handleClose();
                } else {
                    message.error(msg);
                    handleClose();
                }
            },
            onError: error => message.error(error)
        });
    }
    const onLike = (cancel, rule) => {
        let func;
        if (cancel) {
            func = cancellike;
        } else {
            func = like;
        }
        func({sub_rule_id: rule.id}, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    message.success(msg)
                    const tmp = [...ruleList];
                    const item = tmp.find(x => x.id === rule.id)
                    if (cancel) {
                        item.likeCount = item.likeCount - 1;
                        item.liked = false;
                    } else {
                        item.likeCount = item.likeCount + 1;
                        item.liked = true;
                    }
                    setRuleList(tmp);
                } else {
                    message.error(msg)
                }
            }
        })
    }
    const onHate = (cancel, rule) => {
        let func;
        if (cancel) {
            func = cancelHate;
        } else {
            func = hate;
        }
        func({sub_rule_id: rule.id}, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    message.success(msg)
                    const tmp = [...ruleList];
                    const item = tmp.find(x => x.id === rule.id)
                    if (cancel) {
                        item.hateCount = item.hateCount - 1;
                        item.hated = false;
                    } else {
                        item.hateCount = item.hateCount + 1;
                        item.hated = true;
                    }
                    setRuleList(tmp);
                } else {
                    message.error(msg)
                }
            }
        })
    }
    const onInstall = (rule) => {
        navigate("/subscribe/edit-custom-sub?sub_rule_id=" + rule.id);
    }
    return (
        <Dialog
            open={!!open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            // maxWidth={showFilterForm ? "md" : "xs"}
            fullWidth={true}
        >
            <DialogTitle id="alert-dialog-title">
                确定要订阅 {name}{year ? "(" + year + ")" : ""} 吗？
            </DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid xs={12} item>
                        {data?.season && data?.season.length > 0 &&
                        <SeasonSelect text={"订阅季数"} items={data?.season} seasonDoubanId={seasonDoubanId}
                                      setSeasonDoubanId={setSeasonDoubanId}/>}
                        <FormControl m={4} fullWidth>
                            <Select
                                name="filterName"
                                value={filterName}
                                onChange={onChange}
                                defaultValue="system:autoSelectFilter"
                            >
                                <MenuItem value="system:autoSelectFilter">自动选择过滤器</MenuItem>
                                <MenuItem value="system:unUseFilter">不使用任何过滤器</MenuItem>
                                <MenuItem value="system:newFilter">独立设置过滤器</MenuItem>
                                <Divider/>
                                {filterOptionsContextData?.filter_name_list ? filterOptionsContextData?.filter_name_list.map((value, i) => (
                                    <MenuItem key={value} value={value}>{value}</MenuItem>
                                )) : <MenuItem>没有设置任何过滤器</MenuItem>}
                            </Select>
                            <FormHelperText>
                            <span>
                                将按照设定的过滤器去选择资源
                            </span></FormHelperText>
                        </FormControl>
                        {showFilterForm &&
                        <FilterForm showFilterName={false} showApplyInfo={false} showFilterTemplate={true}
                                    filterOptions={filterOptionsContextData} onSubmit={null} myRef={myRef}/>}
                    </Grid>
                    {ruleList && ruleList.length > 0 && !showFilterForm && <><Grid>
                        <Typography variant="h5" component="div" mt={2} gutterBottom>
                            可以使用以下自定义订阅
                        </Typography>
                    </Grid><Grid xs={12} item>
                        <ShareRuleList data={ruleList} onLike={onLike} onHate={onHate} onInstall={onInstall}
                                       multipleColumns={false}/>
                    </Grid></>}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={handleSubmit} autoFocus disabled={isLoading}>
                    确定
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default SubscribeDialog;
