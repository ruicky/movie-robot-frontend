import React, {useState} from "react";

export function useSmartForm({
                                 defaultValues
                             }) {
    const [values, setValues] = useState(defaultValues);
    const setFieldValue = (name, value) => {
        const tmp = {...values};
        tmp[name] = value;
        setValues(tmp);
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
        if (/checkbox/.test(type)) {
            val = checked;
        } else {
            val = value;
        }
        setFieldValue(name, val);
    }
    return {
        values,
        setFieldValue,
        handleChange
    }
}