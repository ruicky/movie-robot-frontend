import {Box, Checkbox, FormControlLabel, IconButton, List, ListItem, ListItemText} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import React, {useEffect, useState} from "react";

const PriorityList = ({items, onChange, dense = true}) => {
    const [data, setData] = useState();
    useEffect(() => {
        setData(items?.map((item) => {
            return {
                label: item.label,
                value: item.value,
                checked: item.selected
            }
        }));
    }, [items])
    const handleChange = (data) => {
        if (!data) {
            return;
        }
        if (onChange) {
            onChange(data.map((item) => {
                return {
                    label: item.label,
                    value: item.value,
                    selected: item.checked
                }
            }));
        }
    }
    const swapItem = function (arr, fromIndex, toIndex) {
        arr[toIndex] = arr.splice(fromIndex, 1, arr[toIndex])[0];
        return arr;
    };
    const onUp = (item, index) => {
        if (index === 0) {
            return;
        }
        const tmp = [...data];
        setData(swapItem(tmp, index, index - 1));
        handleChange(tmp);
    }
    const onDown = (item, index) => {
        if (index === data.length - 1) {
            return;
        }
        const tmp = [...data];
        setData(swapItem(tmp, index, index + 1));
        handleChange(tmp);
    }
    const onCheckboxChange = (checked, index) => {
        const tmp = [...data];
        tmp[index].checked = checked;
        setData(tmp);
        handleChange(tmp);
    }

    return (
        <List dense={dense}>
            {data && data.length > 0 && data.map((item, index) => (
                <ListItem key={item?.label} divider={index !== data.length - 1}
                          secondaryAction={
                              <Box>
                                  <IconButton disabled={index === 0 || (item.checked !== null && item.checked !== undefined && !item.checked)}
                                              onClick={() => onUp(item, index)}>
                                      <ExpandLess/>
                                  </IconButton>
                                  <IconButton
                                      disabled={index === data.length - 1 || (item.checked !== null && item.checked !== undefined && !item.checked)}
                                      onClick={() => onDown(item, index)}>
                                      <ExpandMore/>
                                  </IconButton>
                              </Box>
                          }
                >
                    <ListItemText
                        primary={item.checked !== undefined && item.checked !== null ? (<FormControlLabel
                            control={<Checkbox checked={item?.checked}
                                               onChange={(e) => onCheckboxChange(e.target.checked, index)}/>}
                            label={item?.label}/>) : item.label}
                    />
                </ListItem>))}
        </List>
    )
}
export default PriorityList