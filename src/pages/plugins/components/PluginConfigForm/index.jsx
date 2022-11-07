import {useSmartForm} from "@/components/SmartForm";
import {Grid, TextField, Typography} from "@mui/material";
import * as React from "react";
import {useEffect, useImperativeHandle} from "react";

const Field = ({smartForm, fieldName, fieldType, label, helperText}) => {
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
                fullWidth
            />;
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
    }))
    useEffect(() => {
        if (fields && fields.length > 0) {
            fields.map((item) => {
                let val = smartForm.values[item.fieldName];
                if (val!==item.defaultValue) {
                    smartForm.setFieldValue(item.fieldName, item.defaultValue)
                }
            });
        }
    }, [fields])
    return (<Grid spacing={2} container>
        {title && <Grid>
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
            />
        </Grid>)}
    </Grid>);
}