import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import * as React from "react";
import {Autocomplete} from "@mui/lab";

export const Field = ({smartForm, fieldName, fieldType, label, helperText, enumValues = null, multiValue = true}) => {
    switch (fieldType) {
        case "String":
            return <FormControl fullWidth><TextField
                type="text"
                name={fieldName}
                label={label}
                helperText={helperText}
                my={3}
                value={smartForm.values[fieldName] ? smartForm.values[fieldName] : ""}
                onChange={smartForm.handleChange}
                multiline={multiValue}
                fullWidth
            /></FormControl>;
        case "Bool":
            return <FormControl>
                <FormControlLabel control={<Checkbox name={fieldName}
                                                     checked={smartForm.values[fieldName] ? smartForm.values[fieldName] : false}
                                                     onChange={smartForm.handleChange}/>} label={label}/>
                {helperText && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>;
        case "Enum":
            if (multiValue) {
                return <FormControl fullWidth>
                    <Autocomplete
                        multiple
                        getOptionLabel={(option) => option.name}
                        value={enumValues ? enumValues.filter((item) => {
                            return (smartForm.values[fieldName] || []).includes(item.value);
                        }) : []}
                        options={enumValues || []}
                        renderInput={(params) => <TextField {...params} placeholder={label}/>}
                        onChange={(e, val) => smartForm.setFieldValue(fieldName, val.map((item) => {
                            return item.value
                        }))}
                    />
                    {helperText && <FormHelperText>{helperText}</FormHelperText>}
                </FormControl>;
            } else {
                return <FormControl fullWidth>
                    <InputLabel id="select-label">{label}</InputLabel>
                    <Select
                        name={fieldName}
                        labelId="select-label"
                        value={smartForm.values[fieldName] ? smartForm.values[fieldName] : ""}
                        label={label}
                        onChange={smartForm.handleChange}
                    >
                        {enumValues && enumValues.map((item) => <MenuItem
                            value={item.value}>{item.name}</MenuItem>)}
                    </Select>
                    {helperText && <FormHelperText>{helperText}</FormHelperText>}
                </FormControl>;
            }
        default:
            return <></>;
    }
}