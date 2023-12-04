import { Helmet } from "react-helmet-async";
import { Divider as MuiDivider, Grid, Typography } from "@mui/material";
import CustomList from "@/pages/subscribe/Custom/CustomList";
import React, { useEffect, useState } from "react";
import { FilterOptionsProvider } from "@/contexts/FilterOptionsProvider";
import { useNavigate } from "react-router-dom";
import { ShareRuleList } from "@/pages/subscribe/components/ShareRuleList";
import { spacing } from "@mui/system";
import styled from "styled-components/macro";
import {
    useCancelHateSubRule,
    useCancelLikeSubRule,
    useGetTopSubRuleList,
    useHateSubRule,
    useLikeSubRule,
    useParseSubRuleString
} from "@/utils/subscribe";
import message from "@/utils/message";
import { ImportRuleDialog } from "@/pages/subscribe/Custom/ImportRuleDialog";

const Divider = styled(MuiDivider)(spacing);

const CustomIndex = () => {
    const navigate = useNavigate();
    const [ruleList, setRuleList] = useState(null);
    const [showImport, setShowImport] = useState(null);

    const { data: ruleListData } = useGetTopSubRuleList();
    const { mutate: like } = useLikeSubRule();
    const { mutate: cancellike } = useCancelLikeSubRule();
    const { mutate: hate } = useHateSubRule();
    const { mutate: cancelHate } = useCancelHateSubRule();
    const { mutate: parseSubRuleString } = useParseSubRuleString();
    useEffect(() => {
        if (ruleListData?.data) {
            setRuleList(ruleListData?.data);
        }
    }, [ruleListData])
    const onAdd = () => {
        navigate("/subscribe/edit-custom-sub");
    };
    const onLike = (cancel, rule) => {
        let func;
        if (cancel) {
            func = cancellike;
        } else {
            func = like;
        }
        func({ sub_rule_id: rule.id }, {
            onSuccess: res => {
                const { code, message: msg, data } = res;
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
        func({ sub_rule_id: rule.id }, {
            onSuccess: res => {
                const { code, message: msg, data } = res;
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
    const onImport = (ruleString) => {
        parseSubRuleString({
            rule_string: ruleString
        }, {
            onSuccess: res => {
                const { code, message: msg, data } = res;
                if (code === 0) {
                    navigate("/subscribe/edit-custom-sub", { replace: false, state: data });
                } else {
                    message.error(msg)
                }
            }
        })
    }
    return (<>
        <Helmet title="自定义订阅" />
        <Typography variant="h3" gutterBottom>
            自定义订阅
        </Typography>
        <Divider my={4} />
        {showImport && <ImportRuleDialog
            open={Boolean(showImport)}
            handleClose={() => setShowImport(null)}
            handleSubmit={onImport}
        />}
        <FilterOptionsProvider>
            <Grid container>
                <Grid>
                    <Typography variant="h5" component="div" mt={2} gutterBottom>
                        我的订阅
                    </Typography>
                </Grid>
                <Grid xs={12} item>
                    <CustomList onAdd={onAdd} onImport={() => setShowImport(true)} />
                </Grid>
            </Grid>
            <Grid mt={2} container>
                <Grid>
                    <Typography variant="h5" component="div" mt={2} gutterBottom>
                        热门分享
                    </Typography>
                </Grid>
                <Grid xs={12} item>
                    <ShareRuleList data={ruleList} onLike={onLike} onHate={onHate} onInstall={onInstall} />
                </Grid>
            </Grid>
        </FilterOptionsProvider>
    </>);
}
export default CustomIndex;