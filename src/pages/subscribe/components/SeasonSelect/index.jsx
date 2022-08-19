import {Box, Checkbox, Chip, FormControl, FormHelperText, ListItemText, MenuItem, Select} from "@mui/material";
import React from "react";

const SeasonSelect = ({text, items, seasonDoubanId, setSeasonDoubanId}) => {
    return (
        <FormControl m={4} fullWidth>
            <Select
                name="season"
                value={seasonDoubanId}
                multiple
                onChange={(e) => setSeasonDoubanId(e.target.value)}
                renderValue={(selected) => (
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                        {selected.map((value, index) => (
                            <Chip key={index}
                                  label={`第${items?.find(x => x.doubanId === value)?.seasonNumber}季`}/>
                        ))}
                    </Box>
                )}
            >
                {items?.map((item, index) => (
                    <MenuItem key={index} value={item.doubanId}>
                        <Checkbox checked={seasonDoubanId?.indexOf(item.doubanId) > -1}/>
                        <ListItemText primary={`第${item.seasonNumber}季(${item.releaseYear})`}/>
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>
                {text}
            </FormHelperText>
        </FormControl>
    )
}
export default SeasonSelect;