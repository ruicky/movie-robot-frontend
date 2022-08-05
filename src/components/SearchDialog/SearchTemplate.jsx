import React from 'react';
import {Button as MuiButton, Stack as MuiStack} from '@mui/material';
import styled from "styled-components/macro";


const SearchTemplate = ({templates, templateType, setTemplateType}) => {
    return (
        <Stack spacing={2} direction="row" justifyContent="center" sx={{mb: 2}}>
            {
                templates && templates.map(
                    item =>
                        <Button
                            key={item.type}
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
`;

export default SearchTemplate;