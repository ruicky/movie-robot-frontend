import React, {useReducer} from "react";
import {setIn} from "@/components/SmartForm/utils";

function reducer(state, data) {
    switch (data.type) {
        case 'SET_VALUES':
            return {...state, values: data.payload};
        case 'SET_FIELD_VALUE':
            return {
                ...state,
                values: setIn(state.values, data.payload.field, data.payload.value),
            };
        default:
            return state;
    }
}

export function useSmartForm({
                                 initValues
                             }) {
    const [state, dispatch] = useReducer(reducer, {
        values: initValues
    });
    const setFieldValue = (field, value) => {
        dispatch({type: 'SET_FIELD_VALUE', payload: {field, value}})
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
        ...state,
        setFieldValue,
        handleChange
    }
}