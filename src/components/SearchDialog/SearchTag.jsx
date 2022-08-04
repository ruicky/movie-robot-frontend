import React, {useState} from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Typography,
  Grid,
} from '@mui/material';

const SearchTag = ({title, sx, list, onClick, checkData}) => {
    const [select, setSelect] = useState(true);
    return (
        <Box sx={{...sx}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" display="block" color="text.disabled">
                  {title}
              </Typography>
              <Button
                  variant="text"
                  onClick={() => {
                      Object.keys(checkData).map((key) => (
                          checkData[key] = !select
                      ));
                      setSelect(!select)
                  }}
              >
                {select ? '取消全选' : '全选'}
              </Button>
            </Box>
            <Divider light/>
            <FormControl sx={{width: '100%'}} component="fieldset" variant="standard">
                <Grid>
                  <FormGroup row>
                      {
                          list?.map(item => (
                            <Grid item xs={4} md={2}>
                              <FormControlLabel
                                  key={item.name}
                                  control={
                                      <Checkbox defaultChecked checked={checkData && checkData[item.value]}
                                                onChange={(e) => onClick(e.target.name, e.target.checked)}
                                                name={item.value}/>
                                  }
                                  label={item.name}
                              />
                            </Grid>
                          ))
                      }
                  </FormGroup>
                </Grid>
            </FormControl>
        </Box>
    );
}

export default SearchTag;