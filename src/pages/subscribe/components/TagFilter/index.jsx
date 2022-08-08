import styled from "styled-components/macro";
import { FormControl, Grid, InputLabel, MenuItem, Select, Box, Chip, Checkbox } from "@mui/material";
import React from "react";
import {useTheme} from '@mui/material/styles';
import {find as _find} from 'lodash';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName?.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const MultipleSelect = ({optionTitle, items, selectedValue, onChange, multiple = true}) => {
    const theme = useTheme();

    const handleChange = (event) => {
        const {
            target: {value},
        } = event;
        onChange(value);
    };

    return (
        <div>
            <FormControl variant="standard" sx={{m: 1}} size={"small"} fullWidth>
                <InputLabel>{optionTitle}</InputLabel>
                <Select
                    size={"small"}
                    value={selectedValue ? selectedValue : multiple ? [] : null}
                    onChange={handleChange}
                    MenuProps={MenuProps}
                    fullWidth
                    multiple={multiple}
                    sx={{minHeight: '54px'}}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip
                              key={_find(items, {'value': value})?.value}
                              label={_find(items, {'value': value})?.name}
                            />
                          ))}
                      </Box>
                    )}
                >
                    {items && items.map((item, index) => (
                        <MenuItem
                            key={index}
                            value={item.value}
                            style={getStyles(item.name, selectedValue, theme)}
                        >
                            <Checkbox checked={selectedValue?.indexOf(item.value) > -1} />
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
const FilterWrapper = styled(Grid).attrs({
    spacing: 2,
    container: true
})`
        position: sticky;
        top: 56px;
        ${(props) => props.theme.breakpoints.up("sm")} {
            top: 64px;
        }
        z-index: 100;
        background: ${(props) => props.theme.palette.background.default};
`;
const TagFilter = ({filter, onFilter, options, onSearch}) => {
    return (
        <FilterWrapper sx={{
            display: "flex",
            my: 2,
        }}>
            {
                options && options.map((item) => {
                    return (
                        <Grid item xs={12 / options.length}>
                            <MultipleSelect
                                key={item.key}
                                optionTitle={item.title}
                                selectedValue={filter[item.key]}
                                items={item.data}
                                onChange={(value) => {
                                    onFilter({...filter, [item.key]: value});
                                }}
                            />
                        </Grid>
                    );
                })
            }
        </FilterWrapper>
    );
};
export default TagFilter;