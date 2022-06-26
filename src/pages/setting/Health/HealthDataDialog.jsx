import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import HealthDataChart from "@/pages/setting/Health/HealthDataChart";
import {useGetHealthIndicator} from "@/api/HealthApi";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function HealthDataDialog({open, handleClose}) {
    const {data: healthData, isLoading: healthIsLoading, refetch: refetchHealth} = useGetHealthIndicator()

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        核心依赖健康状态
                    </Typography>
                    <Button autoFocus color="inherit" onClick={() => refetchHealth()}>
                        刷新
                    </Button>
                </Toolbar>
            </AppBar>
            <HealthDataChart healthData={healthData}/>
        </Dialog>

    );
}

export default HealthDataDialog;