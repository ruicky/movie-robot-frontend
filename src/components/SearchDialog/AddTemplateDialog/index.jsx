import * as React from 'react';
import {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const TemplateNameDialog = ({open, handleClose, onSubmit}) => {
    const [name, setName] = useState();
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>确认要创建新模版吗</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    您刚才选择的详细条件，可以作为一个新的快捷模版，在搜索时，可以快速按此条件搜索。但你需要设定一个模版名称来区分，不要使用重复的名称。
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="模版名称"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={(e) => onSubmit ? onSubmit(name) : null}>创建</Button>
            </DialogActions>
        </Dialog>
    );
}
export default TemplateNameDialog;