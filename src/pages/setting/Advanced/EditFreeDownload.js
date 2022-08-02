import React, {useEffect} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {
    Alert as MuiAlert,
    Breadcrumbs,
    Button,
    Checkbox,
    Divider as MuiDivider,
    FormControlLabel,
    Link,
    TextField as MuiTextField,
    Typography
} from "@mui/material";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useGetFreeDownloadSetting, useSaveFreeDownload} from "@/api/SettingApi";
import message from "@/utils/message";

const Divider = styled(MuiDivider)(spacing);

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;

function EditForm({}) {
    const navigate = useNavigate();
    const {data: freeDownloadSetting, isLoading: isLoading} = useGetFreeDownloadSetting();
    const {mutateAsync: save, isSaving} = useSaveFreeDownload();

    const formik = useFormik({
        initialValues: {
            enable: false,
            save_path: "/downloads",
            available_space: 1024,
            avg_statistics_period: 10,
            upload_mbps_maximum: 30,
            maximum_active_torrent: 0
        }, validationSchema: Yup.object().shape({
            save_path: Yup.string().max(1000).required("提交保存路径不能为空"),
            available_space: Yup.number().min(50, "可用空间最小值建议为50GB").required("可用空间不能为空"),
            avg_statistics_period: Yup.number().min(1, "数据统计周期最小为1").required("数据统计周期不能为空"),
            upload_mbps_maximum: Yup.number().min(1, "上行带宽速率最小为1").required("上行带宽速率不能为空")
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                save(values, {
                    onSuccess: res => {
                        const {code, message: msg, data} = res;
                        if (code === 0) {
                            message.success('设置流量管理成功，已经生效了。')
                            navigate("/setting/index");
                        } else {
                            message.error(msg)
                        }
                    }
                })
            } catch (error) {
                const message = error.message || "配置出错，请检查网络链接";
                setStatus({success: false});
                setErrors({submit: message});
                setSubmitting(false);
            }
        }
    });

    useEffect(async () => {
        if (freeDownloadSetting && freeDownloadSetting?.data) {
            const data = freeDownloadSetting.data;
            formik.setFieldValue("enable", data.enable !== undefined && data.enable !== null ? data.enable : false);
            formik.setFieldValue("save_path", data.save_path ? data.save_path : '');
            formik.setFieldValue("available_space", data.available_space ? data.available_space : 1024);
            formik.setFieldValue("avg_statistics_period", data.avg_statistics_period ? data.avg_statistics_period : 5);
            formik.setFieldValue("upload_mbps_maximum", data.upload_mbps_maximum ? data.upload_mbps_maximum : 30);
            formik.setFieldValue("maximum_active_torrent", data.maximum_active_torrent ? data.maximum_active_torrent : 0);
        }
    }, [freeDownloadSetting]);
    return (<form noValidate onSubmit={formik.handleSubmit}>
        {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
            {formik.errors.submit}
        </Alert>)}
        <TextField
            type="text"
            name="save_path"
            label="下载保存路径"
            value={formik.values.save_path}
            error={Boolean(formik.touched.save_path && formik.errors.save_path)}
            fullWidth
            helperText={formik.touched.save_path && formik.errors.save_path || (
                <span>
                    提交到下载器的保存路径，建议独立目录与正常影音资源隔离开
                </span>
            )}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="number"
            name="available_space"
            label="磁盘可用空间"
            value={formik.values.available_space}
            error={Boolean(formik.touched.available_space && formik.errors.available_space)}
            fullWidth
            helperText={formik.touched.available_space && formik.errors.available_space || (
                <span>
                    免费下载任务的可用存储空间，单位GB
                </span>
            )}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="number"
            name="avg_statistics_period"
            label="下载数据统计周期"
            value={formik.values.avg_statistics_period}
            error={Boolean(formik.touched.avg_statistics_period && formik.errors.avg_statistics_period)}
            fullWidth
            helperText={formik.touched.avg_statistics_period && formik.errors.avg_statistics_period || (
                <span>
                    1个周期是1分钟，这个周期决定种子淘汰速度，不理解建议采用默认值10
                </span>
            )}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="number"
            name="upload_mbps_maximum"
            label="最大上传速率"
            value={formik.values.upload_mbps_maximum}
            error={Boolean(formik.touched.upload_mbps_maximum && formik.errors.upload_mbps_maximum)}
            fullWidth
            helperText={formik.touched.upload_mbps_maximum && formik.errors.upload_mbps_maximum || (
                <span>
                    最大的上行带宽速率，单位Mbps
                </span>
            )}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="number"
            name="maximum_active_torrent"
            label="最大活跃刷流种子数"
            value={formik.values.maximum_active_torrent}
            error={Boolean(formik.touched.maximum_active_torrent && formik.errors.maximum_active_torrent)}
            fullWidth
            helperText={formik.touched.maximum_active_torrent && formik.errors.maximum_active_torrent || (
                <span>
                    同时下载刷流种子的上限数量，如果超了，就不再新增了，0为不限
                </span>
            )}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <FormControlLabel
            control={<Checkbox
                checked={formik.values.enable}
                onChange={formik.handleChange}
                name="enable"
            />}
            label="启用流量管理任务"
        />
        <Centered>
            <Button
                mr={2}
                size="medium"
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
            >
                保存
            </Button>
        </Centered>

    </form>);
}


const EditFreeDownload = () => {
    return (<React.Fragment>
        <Helmet title="设置流量管理"/>
        <Typography variant="h3" gutterBottom display="inline">
            设置流量管理
        </Typography>

        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/setting/index">
                设置
            </Link>
            <Typography>流量管理</Typography>
        </Breadcrumbs>
        <Divider my={6}/>
        <EditForm/>
    </React.Fragment>);
}
export default EditFreeDownload;