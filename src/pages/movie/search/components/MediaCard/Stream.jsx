import {
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import {SmallButton} from "@/components/core/SmallButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const StreamInfoDialog = ({title, streams}) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <SmallButton size="medium" mr={2} onClick={() => setOpen(true)}>
                {streams[0]}<ExpandMoreIcon/>
            </SmallButton>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <List>
                            {streams.map((item) => (
                                <ListItem key={item}>
                                    <ListItemText
                                        primary={item}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    )
}

const Stream = ({title, streams}) => {
    if (!streams || streams.length === 0) {
        return null;
    }
    const streamSet = new Set(streams.map((s) => {
        return s.display_title;
    }));
    const streamList = Array.from(streamSet)
    return (
        <>
            <Typography variant="subtitle1" color="text.secondary" component="div">
                {title}: {streamList.length === 1 ? streamList[0] :
                <StreamInfoDialog title={"全部" + title} streams={streamList}/>}
            </Typography>
        </>
    )
}
export default Stream;