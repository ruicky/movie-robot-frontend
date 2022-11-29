import {useSmartForm} from "@/components/SmartForm";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import * as React from "react";
import {useEffect, useImperativeHandle} from "react";

const Field = ({smartForm, fieldName, fieldType, label, helperText, enumValues = null}) => {
    switch (fieldType) {
        case "String":
            return <TextField
                type="text"
                name={fieldName}
                label={label}
                helperText={helperText}
                my={3}
                value={smartForm.values[fieldName] ? smartForm.values[fieldName] : ""}
                onChange={smartForm.handleChange}
                multiline={true}
                fullWidth
            />;
        case "Bool":
            return <FormControl>
                <FormControlLabel control={<Checkbox name={fieldName}
                                                     checked={smartForm.values[fieldName] ? smartForm.values[fieldName] : ""}
                                                     onChange={smartForm.handleChange}/>} label={label}/>
                {helperText&&<FormHelperText>{helperText}</FormHelperText>}
            </FormControl>;
        case "Enum":
            return <FormControl fullWidth>
                <InputLabel id="select-label">{label}</InputLabel>
                <Select
                    name={fieldName}
                    labelId="select-label"
                    value={smartForm.values[fieldName] ? smartForm.values[fieldName] : ""}
                    label={label}
                    onChange={smartForm.handleChange}
                >
                    {enumValues && Object.keys(enumValues).map((key) => <MenuItem
                        value={enumValues[key]}>{key}</MenuItem>)}
                </Select>
                {helperText&&<FormHelperText>{helperText}</FormHelperText>}
            </FormControl>;
        default:
            return <></>;
    }
}
export const PluginConfigForm = ({title, fields, formRef}) => {
    const smartForm = useSmartForm({
        initValues: {}
    });
    useImperativeHandle(formRef, () => ({
        getValues: () => smartForm.values
    }));
    useEffect(() => {
        if (fields && fields.length > 0) {
            fields.map((item) => {
                let val = smartForm.values[item.fieldName];
                if (val !== item.defaultValue) {
                    smartForm.setFieldValue(item.fieldName, item.defaultValue);
                }
            });
        }
    }, [fields]);
    return (<Grid spacing={2} container>
        {title && fields && fields.length > 0 && <Grid>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
        </Grid>}
        {fields && fields.map((item, index) => <Grid key={index} xs={12} item>
            <Field
                smartForm={smartForm}
                fieldName={item.fieldName}
                fieldType={item.fieldType}
                label={item.label}
                helperText={item.helperText}
                enumValues={item.enumValues}
            />
        </Grid>)}
    </Grid>);
}