import React, {useState} from 'react';
import {Box, Button, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, Typography} from '@mui/material';

const SearchTag = ({title, sx, list, onClick, checkData}) => {
    const [select, setSelect] = useState(true);
    return (
        <Box sx={{...sx}}>
            <Typography variant="caption" display="block" color="text.disabled" gutterBottom>
                {title}
                <Button
                    variant="text"
                    style={{
                        margin: 0,
                        bottom: 1,
                        padding: 0,
                        paddingRight: '30px',
                        background: "transparent",
                        border: "none"
                    }}
                    onClick={() => {
                        Object.keys(checkData).map((key) => (
                            checkData[key] = !select
                        ));
                        setSelect(!select)
                    }}
                >
                    {!select && "全选"}
                    {select && "取消选中"}
                </Button>
            </Typography>
            <Divider light/>
            <FormControl sx={{m: 3}} component="fieldset" variant="standard">
                <FormGroup row>
                    {
                        list?.map(item => (
                            <FormControlLabel
                                key={item.name}
                                control={
                                    <Checkbox defaultChecked checked={checkData && checkData[item.value]}
                                              onChange={(e) => onClick(e.target.name, e.target.checked)}
                                              name={item.value}/>
                                }
                                label={item.name}
                            />
                        ))
                    }
                </FormGroup>
            </FormControl>
        </Box>
    );
}

export default SearchTag;