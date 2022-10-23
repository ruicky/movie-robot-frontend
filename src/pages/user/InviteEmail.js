import React from "react";
import {NavLink} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {
    Alert as MuiAlert,
    Breadcrumbs,
    Button,
    Divider as MuiDivider,
    Link,
    TextField as MuiTextField,
    Typography
} from "@mui/material";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import {useFormik} from "formik";
import * as Yup from "yup";
import message from "@/utils/message";
import {useInviteEmail} from "@/api/UserApi";

const Divider = styled(MuiDivider)(spacing);

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);


function EditForm({}) {
    const {mutateAsync: inviteEmail, isLoading:isSubmitting} = useInviteEmail();
    const formik = useFormik({
        initialValues: {
            email: ""
        }, validationSchema: Yup.object().shape({
            email: Yup.string().max(256).required("邮箱必须填写"),
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                inviteEmail({
                    email: values.email
                }, {
                    onSuccess: res => {
                        const {code, message: msg} = res;
                        if (code === 0) {
                            message.success(msg)
                        } else {
                            message.error(msg)
                        }
                    }
                })
            } catch (error) {
                const message = error.message || "邀请超时，稍后再试或检查容器网络";

                setStatus({success: false});
                setErrors({submit: message});
                setSubmitting(false);
            }
        }
    });
    return (<form noValidate onSubmit={formik.handleSubmit}>
        {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
            {formik.errors.submit}
        </Alert>)}
        <TextField
            type="text"
            name="email"
            label="邮箱"
            value={formik.values.email}
            error={Boolean(formik.touched.email && formik.errors.email)}
            fullWidth
            helperText="体验激活码将直接发送至您填写的邮箱"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            fullWidth
        >
            发送邀请
        </Button>
    </form>);
}

const EditWeb = () => {
    return (<React.Fragment>
        <Helmet title="发送产品体验码"/>
        <Typography variant="h3" gutterBottom display="inline">
            发送产品体验码
        </Typography>

        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/setting/license">
                授权信息
            </Link>
            <Typography>发送产品体验码</Typography>
        </Breadcrumbs>
        <Divider my={4}/>
        <EditForm/>
    </React.Fragment>);
}
export default EditWeb;