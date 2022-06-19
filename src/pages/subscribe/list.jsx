import React, {useEffect, useState} from 'react';
import {Helmet} from "react-helmet-async";
import ListView from "@/pages/subscribe/components/ListView";
import {useSubscribes} from "@/utils/subscribe";
import {
    Box,
    Button,
    Divider as BtnDivider,
    Divider,
    Grid,
    Menu,
    MenuItem,
    Stack,
    Tab,
    Tabs,
    Typography
} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {FilterOptionsProvider} from "@/components/Selectors/FilterOptionsProvider";
import SubDownloadDialog from "@/pages/subscribe/SubDownloadDialog";
import CustomList from "@/pages/subscribe/CustomList";
import {useSearchParams} from "react-router-dom";

const SubList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [status, setStatus] = useState(0);
    const {data: sublist, isLoading: subIsLoading} = useSubscribes({status})
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [value, setValue] = React.useState((searchParams.get('tab') || 'media'));

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setSearchParams({tab: newValue})
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    useEffect(() => {
        if (searchParams.get('tab')) {
            setValue(searchParams.get('tab'));
        }
    }, [searchParams])
    return (
        <>
            <Helmet title="我的订阅"/>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {
                    setStatus(null)
                    handleClose()
                }}>
                    全部
                </MenuItem>
                <MenuItem onClick={() => {
                    setStatus(0)
                    handleClose()
                }}>
                    订阅中
                </MenuItem>
                <MenuItem onClick={() => {
                    setStatus(2)
                    handleClose()
                }}>
                    洗版中
                </MenuItem>
                <MenuItem onClick={() => {
                    setStatus(1)
                    handleClose()
                }}>
                    已完成
                </MenuItem>
            </Menu>
            <Grid justifyContent="space-between" container spacing={6}>
                <Grid item>
                    <Box sx={{width: '100%'}}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            textColor="secondary"
                            indicatorColor="secondary"
                            aria-label="secondary tabs example"
                        >
                            <Tab value="media" label={(<Typography variant="h3" gutterBottom>
                                影片订阅
                                <Button
                                    edge="end"
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-expanded={open ? 'true' : undefined}
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                    endIcon={<ArrowDropDownIcon/>}
                                    variant="h3"
                                >
                                    {status == null && "全部"}
                                    {status === 0 && "订阅中"}
                                    {status === 1 && "已完成"}
                                    {status === 2 && "洗版中"}
                                </Button>
                            </Typography>)}/>
                            <Tab value="custom" label={<Typography variant="h3" gutterBottom>
                                自定义订阅
                            </Typography>}/>
                        </Tabs>
                    </Box>

                </Grid>
                <Grid item>
                    {value === "media" &&
                    <Stack direction="row" divider={<BtnDivider orientation="vertical" flexItem/>} spacing={1}>
                        <SubDownloadDialog/>
                    </Stack>}
                </Grid>
            </Grid>
            <Divider my={4}/>
            {value === "media" && <FilterOptionsProvider>
                <ListView
                    items={sublist?.data}
                    isLoading={subIsLoading}

                />
            </FilterOptionsProvider>}
            {value === "custom" && <CustomList/>}
        </>
    );

};

export default SubList;
