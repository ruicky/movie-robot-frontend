import {Button, Stack, Typography} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import {useApprovedSubscribe, useRefuseSubscribe} from "@/utils/subscribe";
import message from "@/utils/message";

const MessageAction = ({type, args, has_action, action_log, description, onSuccess = null}) => {
    const {mutate: approved, isLoading: isApproved} = useApprovedSubscribe();
    const {mutate: refuse, isLoading: isRefuse} = useRefuseSubscribe();
    if (!has_action) {
        return description;
    }
    if (action_log) {
        if (description) {
            return description + "(" + action_log + ")";
        }
        return <Typography>{action_log}</Typography>;
    }
    const onApproved = (subId) => {
        approved({sub_id: subId}, {
            onSuccess: resData => {
                const {code, message: msg} = resData;
                if (code === 0) {
                    message.success(msg);
                    if (onSuccess) {
                        onSuccess();
                    }
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
                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    message.error(msg);
                }
            },
            onError: error => message.error(error)
        });
    }

    if (type === 'SmartDownload' && args?.approval_enable) {
        return (<>
            <Typography>
                {description}
            </Typography>
            <Stack direction="row" justifyContent="flex-end">
                <Button size="small" startIcon={<CheckIcon/>} onClick={() => onApproved(args.sub_id)}>同意</Button>
                <Button size="small" startIcon={<ClearIcon/>} onClick={() => onRefuse(args.sub_id)}>拒绝</Button>
            </Stack>
        </>);
    } else {
        return description;
    }
}
export default MessageAction;