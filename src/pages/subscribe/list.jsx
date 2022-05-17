import React, {useState} from 'react';
import {Helmet} from "react-helmet-async";
import ListView from "@/pages/subscribe/components/ListView";
import {useSubscribes} from "@/utils/subscribe";
import {Button, Divider as BtnDivider, Divider, Grid, Menu, MenuItem, Stack, Typography} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {FilterOptionsProvider} from "@/components/Selectors/FilterOptionsProvider";
import SubDownloadDialog from "@/pages/subscribe/SubDownloadDialog";

const SubList = () => {
    const [status, setStatus] = useState(0);
    const {data: sublist, isLoading: subIsLoading} = useSubscribes({status})
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
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
                    <Typography variant="h3" gutterBottom>
                        我的订阅
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
                    </Typography>
                </Grid>
                <Grid item>
                    <Stack direction="row" divider={<BtnDivider orientation="vertical" flexItem/>} spacing={1}>
                        <SubDownloadDialog/>
                    </Stack>
                </Grid>
            </Grid>
            <Divider my={4}/>
            <FilterOptionsProvider>
                <ListView
                    items={sublist?.data}
                    isLoading={subIsLoading}

                />
            </FilterOptionsProvider>
        </>
    );

};

export default SubList;
