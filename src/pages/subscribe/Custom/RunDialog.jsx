import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    TextField
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import {useContext} from "react";
import {useSmartForm} from "@/components/SmartForm";
import {FilterOptionsContext} from "@/contexts/FilterOptionsProvider";
import {Autocomplete} from "@mui/lab";

export const RunDialog = ({subId, open, handleClose, handleRun}) => {
    const filterOptions = useContext(FilterOptionsContext);
    const {
        cate_level1_list: cateLevel1List
    } = filterOptions;
    const smartForm = useSmartForm({
        initValues: {
            keyword: '',
            cate_level1: []
        }
    });
    return (
        <Dialog maxWidth={"sm"} open={open}>
            <DialogTitle>
                立即运行一次自定义订阅规则
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid spacing={4} sx={{mt:1}} container>
                    <Grid item xs={12}>
                        <TextField
                            type="text"
                            name="keyword"
                            label="搜索关键字"
                            helperText={"用关键字去站点搜索到结果后，交给自定义订阅规则处理"}
                            fullWidth
                            my={3}
                            value={smartForm.values.keyword}
                            onChange={smartForm.handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl m={4} fullWidth>
                            <Autocomplete
                                multiple
                                getOptionLabel={(option) => option.name}
                                value={cateLevel1List && cateLevel1List.filter((item) => {
                                    return smartForm.values.cate_level1.includes(item.value);
                                })}
                                options={cateLevel1List}
                                renderInput={(params) => <TextField {...params} placeholder="分类"/>}
                                onChange={(e, val) => smartForm.setFieldValue('cate_level1', val.map((item) => {
                                    return item.value
                                }))}
                            />
                            <FormHelperText>
                                搜索资源分类，留空搜全部
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={() => handleRun(subId, smartForm.values)}>立即运行</Button>
            </DialogActions>
        </Dialog>
    );
}