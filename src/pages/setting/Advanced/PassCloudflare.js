import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { useGetPassCloudflare, useSavePassCloudflare } from "@/api/SettingApi";
import message from "@/utils/message";

const Divider = styled(MuiDivider)(spacing);

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);


function PassCloudflareForm({ isInit }) {
  const navigate = useNavigate();
  const { data: getConfig } = useGetPassCloudflare();
  const { mutateAsync: saveConfig } = useSavePassCloudflare();
  const formik = useFormik({
    initialValues: {
      fs_api: "http://"
    }, onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      try {
        saveConfig({
          fs_api: values.fs_api
        }, {
          onSuccess: res => {
            const { code, message: msg } = res;
            if (code === 0) {
              message.success("更改Cloudflare穿透设置成功。");
              navigate("/setting/index");
            } else {
              message.error(msg);
            }
          }
        });
      } catch (error) {
        const message = error.message || "配置出错啦";

        setStatus({ success: false });
        setErrors({ submit: message });
        setSubmitting(false);
      }
    }
  });

  useEffect(async () => {
    if (getConfig?.data) {
      formik.setFieldValue("fs_api", getConfig.data?.fs_api ? getConfig.data?.fs_api : "http://");
    }
  }, [getConfig]);
  return (<form noValidate onSubmit={formik.handleSubmit}>
    {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
      {formik.errors.submit}
    </Alert>)}
    <Typography>Cloudflare穿透可以使站点爬虫更加稳定。但这是一项可选设置，如果你不配置则会自动使用VIP专用的香港节点Cloudflare
      Pass服务。如果这里设置了本地地址，将会使用你本地的服务。</Typography>
    <Typography>使用本地的flaresolverr服务有一定的好处，一些站点的Cloudflare校验严格，会要求所有访问IP一致，否则无法完成自动登录等一些爬虫操作。</Typography>
    <TextField
      type="text"
      name="fs_api"
      label="flaresolverr api地址"
      value={formik.values.fs_api}
      error={Boolean(formik.touched.fs_api && formik.errors.fs_api)}
      fullWidth
      helperText="部署在本地的flaresolverr接口地址，http://host/v1 注意结尾带/v1"
      onBlur={formik.handleBlur}
      onChange={formik.handleChange}
      my={3}
    />
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="primary"
      disabled={formik.isSubmitting}
    >
      保存
    </Button>
  </form>);
}

const PassCloudflare = () => {
  return (<React.Fragment>
    <Helmet title="Cloudflare穿透设置" />
    <Typography variant="h3" gutterBottom display="inline">
      Cloudflare穿透设置
    </Typography>

    <Breadcrumbs aria-label="Breadcrumb" mt={2}>
      <Link component={NavLink} to="/setting/index">
        设置
      </Link>
      <Typography>Cloudflare穿透设置</Typography>
    </Breadcrumbs>
    <Divider my={6} />
    <PassCloudflareForm />
  </React.Fragment>);
};
export default PassCloudflare;