import React, {useEffect, useImperativeHandle, useReducer} from "react";
import {setIn} from "@/components/SmartForm/utils";
import {Grid, Typography} from "@mui/material";
import {Field} from "@/components/SmartForm/Field";

function reducer(state, data) {
    switch (data.type) {
        case 'SET_VALUES':
            return {...state, values: data.payload};
        case 'SET_FIELD_VALUE':
            return {
                ...state,
                values: setIn(state.values, data.payload.field, data.payload.value),
            };
        case 'SET_FIELD_ERROR':
            return {
                ...state,
                errors: setIn(state.errors, data.payload.field, data.payload.value),
            };
        default:
            return state;
    }
}

export function useSmartForm({
                                 initValues
                             }) {
    const [state, dispatch] = useReducer(reducer, {
        values: initValues,
        errors: {}
    });
    const setFieldValue = (field, value) => {
        dispatch({type: 'SET_FIELD_VALUE', payload: {field, value}})
    }
    const setFieldError = (field, value) => {
        dispatch({type: 'SET_FIELD_ERROR', payload: {field, value}})
    }
    const handleChange = (event) => {
        const target = event.target
            ? event.target
            : event.currentTarget;
        const {
            type,
            name,
            value,
            checked
        } = target;
        let val;
        let parsed;
        if (/checkbox/.test(type)) {
            if (typeof checked === 'boolean') {
                val = Boolean(checked);
            } else {
                val = checked;
            }
        } else if (/number/.test(type)) {
            val = ((parsed = parseFloat(value)), isNaN(parsed) ? '' : parsed);
        } else {
            val = value;
        }
        setFieldValue(name, val);
    }
    return {
        ...state,
        setFieldValue,
        handleChange
    }
}

export const SmartForm = ({title, fields, formRef = null}) => {
    const smartForm = useSmartForm({
        initValues: {}
    });
    useImperativeHandle(formRef, () => ({
        getValues: () => {
            return smartForm.values;
        }
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
        {title && fields && fields.length > 0 && <Grid xs={12} item>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
        </Grid>}
        {fields && fields.map((item, index) => <Grid key={item.fieldName} xs={12}
                                                     pb={index !== fields.length - 1 ? 1 : 0} item>
            <Field
                smartForm={smartForm}
                fieldName={item.fieldName}
                fieldType={item.fieldType}
                label={item.label}
                helperText={item.helperText}
                enumValues={item.enumValues}
                multiValue={item.multiValue}
            />
        </Grid>)}
    </Grid>);
}