import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    MenuItem,
    Select,
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
            cate_level1: [],
            all_pages: false,
            search_type: 'keyword'
        }
    });
    return (
        <Dialog maxWidth={"sm"} open={open}>
            <DialogTitle>
                搜索资源并立即运行一次自定义订阅
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
                <Grid spacing={4} sx={{mt: 1}} container>
                    <Grid xs={12} item>
                        <FormControl fullWidth>
                            <Select
                                name="search_type"
                                value={smartForm.values.search_type}
                                onChange={smartForm.handleChange}
                                fullWidth
                            >
                                <MenuItem value={"keyword"}>关键字搜索</MenuItem>
                                <MenuItem value={"imdb"}>IMDB搜索</MenuItem>
                                <MenuItem value={"list"}>获取最新列表页结果</MenuItem>
                            </Select>
                            <FormHelperText>选择搜索方式</FormHelperText>
                        </FormControl>
                    </Grid>
                    {smartForm.values.search_type !== 'list' && <Grid item xs={12}>
                        <TextField
                            type="text"
                            name="keyword"
                            label="搜索内容"
                            helperText={"按此方式搜索到种子结果后，交给自定义订阅规则处理"}
                            fullWidth
                            my={3}
                            value={smartForm.values.keyword}
                            onChange={smartForm.handleChange}
                        />
                    </Grid>}
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
                    {smartForm.values.search_type !== 'list' && <Grid xs={12} item>
                        <FormControlLabel
                            control={<Checkbox
                                name="all_pages"
                                checked={smartForm.values.all_pages}
                                onChange={smartForm.handleChange}
                            />}
                            label="自动翻页得到所有搜索结果，最多翻10页（搜索结果较多请谨慎开启）"
                        />
                    </Grid>}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={() => handleRun(subId, smartForm.values)}>立即运行</Button>
            </DialogActions>
        </Dialog>
    );
}