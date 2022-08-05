import React from 'react';
import {Button as MuiButton, Stack as MuiStack} from '@mui/material';
import styled from "styled-components/macro";


const SearchTemplate = ({templates, templateType, setTemplateType}) => {
    return (
        <Stack spacing={2} direction="row"  sx={{mb: 2}}>
            {
                templates && templates.map(
                    item =>
                        <Button
                            key={item.type}
                            sx={{whiteSpace: 'nowrap', flexShrink: 0}}
                            variant={templateType === item.type ? 'contained' : 'text'}
                            onClick={() => setTemplateType(item.type)}>
                            {item.name}
                        </Button>
                )
            }
        </Stack>
    );
}

const Button = styled(MuiButton)`
  border-radius: 50px;
`;

const Stack = styled(MuiStack)`
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
    overflow-y: hidden;
    overflow-x: scroll;
    &::-webkit-scrollbar {
        display: none; /* Safari and Chrome */
    }
    //解决内容居中后，滚动条左侧不显示全的问题
    &>button:first-child {
        margin-left: auto;
    }
    &>button:last-child {
        margin-right: auto;
    }
`;

export default SearchTemplate;