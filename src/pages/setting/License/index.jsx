import React, {useEffect, useState} from "react";
import styled from "styled-components/macro";
import {NavLink, useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet-async";

import {
    Breadcrumbs as MuiBreadcrumbs,
    Button,
    Card as MuiCard,
    CardActions,
    CardContent,
    CardHeader as MuiCardHeader,
    Divider as MuiDivider,
    Grid,
    IconButton,
    Link,
    Typography,
} from "@mui/material";
import {spacing} from "@mui/system";
import {useGetLicenseDetail} from "@/api/AuthApi";
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import {UpdateUserDialog} from "@/pages/setting/License/updateUserDialog";

const Card = styled(MuiCard)(spacing);

const CardHeader = styled(MuiCardHeader)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Price = styled.div`
  text-align: center;
  padding-bottom: ${(props) => props.theme.spacing(3)};
`
const Header = styled.div`
  padding: ${(props) => props.theme.spacing(6)} 0;
`;

function LicenseItem({children, title, price, period, selected = false, actionsComponent = null}) {
    return (<Card p={5}>
        <CardHeader
            title={title}
            titleTypographyProps={{align: "center"}}
            subheader={selected ? "当前选择" : null}
            subheaderTypographyProps={selected ? {align: "center"} : null}
            action={selected ? <FavoriteIcon/> : null}
            pb={0}
            pt={2}
        />
        <CardContent>
            <Price>
                <Typography
                    component="h2"
                    variant="h1"
                    color="textPrimary"
                    align="center"
                    display="inline"
                >
                    {price}
                </Typography>
                <Typography
                    variant="h5"
                    color="textSecondary"
                    align="center"
                    display="inline"
                >
                    {period}
                </Typography>
            </Price>
            <Typography variant="subtitle1" align="center" sx={{minWidth: 180}}>
                {children}
            </Typography>
        </CardContent>
        <CardActions>
            {actionsComponent}
        </CardActions>
    </Card>);
}

function License() {
    const navigate = useNavigate();
    const {data: licenseDetail} = useGetLicenseDetail();
    const [licenseMessage, setLicenseMessage] = useState(null);
    const [user, setUser] = useState(null);
    const [isVip, setIsVip] = useState(true);
    const [licenseType, setLicenseType] = useState('');
    const [showUpdateUser, setShowUpdateUser] = useState(null);
    useEffect(() => {
        if (!licenseDetail?.data) {
            return;
        }
        const {
            licenseType,
            expireDays,
            user
        } = licenseDetail?.data;
        setUser(user);
        setLicenseType(licenseType);
        if (licenseType === 'VIP') {
            setLicenseMessage('您已经是最高等级用户，尊贵的永久授权！❤️🎉🌹');
            setIsVip(true);
        } else if (licenseType === 'SubVIP') {
            setLicenseMessage(`您当前为订阅授权，授权还有${expireDays}天过期🌹`);
            setIsVip(true);
        } else if (licenseType === 'ExperienceUser') {
            setLicenseMessage(`您当前为体验用户，体验授权还有${expireDays}天过期。`);
            setIsVip(false);
        }
    }, [licenseDetail])
    const onUpdateNicknameSuccess = (nickname) => {
        const tmp = {...user};
        tmp.nickname = nickname;
        setUser(tmp);
    }
    return (
        <React.Fragment>
            <Helmet title="我的授权信息"/>
            <Typography variant="h3" gutterBottom display="inline">
                授权信息
            </Typography>
            <Breadcrumbs aria-label="Breadcrumb" mt={2}>
                <Link component={NavLink} to="/setting/index">
                    设置
                </Link>
                <Typography>授权信息</Typography>
            </Breadcrumbs>

            <Divider my={4}/>

            <Header>
                <Typography variant="h3" gutterBottom align="center">
                    Hi, {user?.nickname} !
                    <IconButton size={"small"} onClick={() => setShowUpdateUser(user)}>
                        <EditIcon/>
                    </IconButton>
                </Typography>

                <Typography variant="subtitle1" gutterBottom align="center">
                    {licenseMessage}
                </Typography>
            </Header>
            <UpdateUserDialog
                open={Boolean(showUpdateUser)}
                user={showUpdateUser}
                handleClose={() => setShowUpdateUser(null)}
                handleSuccess={onUpdateNicknameSuccess}
            />
            <Grid container justifyContent="center">
                <Grid item xs={12} lg={10}>
                    <Grid container spacing={6} alignItems="flex-end">
                        <Grid item xs={12} md={4}>
                            <LicenseItem
                                showPrice={false}
                                title={"免费体验"}
                                selected={licenseType === 'ExperienceUser'}
                                price={"¥0"}
                                period={"/3个月"}
                                actionsComponent={
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => navigate("/user/invite-email")}
                                        disabled={licenseType === 'ExperienceUser'}
                                    >
                                        发送邀请
                                    </Button>
                                }>
                                最大同时使用IP：1<br/>
                                最大同时使用设备：1<br/>
                                使用自建影视数据库<br/>
                                试用期免费升级应用<br/>
                                社区问题答疑<br/>
                                <Link target={"_blank"}
                                      href={"https://yee329.notion.site/b712e719e79b47f58ff374737609d3be"}>详情</Link>
                                <br/><br/>
                            </LicenseItem>
                        </Grid>
                        {/*<Grid item xs={12} md={4}>*/}
                        {/*    <LicenseItem*/}
                        {/*        showPrice={!isVip}*/}
                        {/*        title={"订阅授权"}*/}
                        {/*        selected={licenseType === 'SubVIP'}*/}
                        {/*        price={licenseType === 'SubVIP' ? '已购买' : '¥60'}*/}
                        {/*        period={licenseType === 'SubVIP' ? "" : "/每年"}*/}
                        {/*        actionsComponent={licenseType === 'SubVIP' ? (*/}
                        {/*            <Button fullWidth variant="contained" color="primary"*/}
                        {/*                    onClick={() => window.open("https://discord.gg/SMauZCXgKx")}>*/}
                        {/*                去产品社区*/}
                        {/*            </Button>*/}
                        {/*        ) : (*/}
                        {/*            <Button*/}
                        {/*                fullWidth*/}
                        {/*                variant="outlined"*/}
                        {/*                color="primary"*/}
                        {/*                onClick={() => window.open("https://yee329.notion.site/b712e719e79b47f58ff374737609d3be")}*/}
                        {/*                disabled={licenseType === 'VIP'}*/}
                        {/*            >*/}
                        {/*                购买*/}
                        {/*            </Button>*/}
                        {/*        )}*/}
                        {/*    >*/}
                        {/*        最大同时使用IP：1<br/>*/}
                        {/*        最大同时使用设备：不限<br/>*/}
                        {/*        使用自建影视数据库<br/>*/}
                        {/*        订阅期免费升级应用<br/>*/}
                        {/*        Discord专属身份组<br/>*/}
                        {/*        社区问题答疑<br/>*/}
                        {/*        <Link target={"_blank"}*/}
                        {/*              href={"https://yee329.notion.site/b712e719e79b47f58ff374737609d3be"}>详情</Link>*/}
                        {/*    </LicenseItem>*/}
                        {/*</Grid>*/}
                        <Grid item xs={12} md={4}>
                            <LicenseItem
                                showPrice={licenseType !== 'VIP'}
                                title={"永久授权"}
                                selected={licenseType === 'VIP'}
                                price={licenseType === 'VIP' ? '已购买' : '¥299'}
                                period={licenseType === 'VIP' ? '' : '/永久'}
                                actionsComponent={licenseType === 'VIP' ? (
                                    <Button fullWidth variant="contained" color="primary"
                                            onClick={() => window.open("https://discord.gg/SMauZCXgKx")}>
                                        去产品社区
                                    </Button>
                                ) : (
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => window.open("https://yee329.notion.site/b712e719e79b47f58ff374737609d3be")}
                                    >
                                        {licenseType === 'SubVIP' ? "升级" : "购买"}
                                    </Button>
                                )}
                            >
                                最大同时使用IP：1<br/>
                                最大同时使用设备：不限<br/>
                                使用自建影视数据库<br/>
                                永久免费升级应用<br/>
                                Discord专属身份组<br/>
                                社区问题答疑<br/>
                                <Link target={"_blank"}
                                      href={"https://yee329.notion.site/b712e719e79b47f58ff374737609d3be"}>详情</Link>
                            </LicenseItem>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default License;
