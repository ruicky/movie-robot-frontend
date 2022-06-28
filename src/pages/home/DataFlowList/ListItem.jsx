import React from 'react';
import {Box, Divider, IconButton, Typography} from "@mui/material";
import LinesEllipsis from 'react-lines-ellipsis'
import RatingLabel from "@/pages/subscribe/components/RatingLabel";
import AddCircleIcon from '@mui/icons-material/AddCircle';
const ListItem = ({data, onSub}) => {
    return (
        <Box>
            <Box
                sx={{
                    // bgcolor: 'background.paper',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    boxShadow: 1,
                    display: 'flex',
                }}
            >
                <Box
                    component="img"
                    sx={{
                        height: 150,
                        width: 100,
                        maxHeight: {xs: 150, md: 200},
                        maxWidth: {xs: 100, md: 250},
                    }}
                    alt={data?.title}
                    src={data?.poster_url}
                />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        // justifyContent: 'center',
                        pt: 2,
                        ml: 2,
                        minWidth: {md: 350},
                    }}
                >
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                        <Typography variant="h6" gutterBottom component="div">
                            {data?.title}
                        </Typography>
                        {!data?.isSub && <IconButton aria-label="play" onClick={() => onSub(data)}>
                            <AddCircleIcon/>
                        </IconButton>}
                    </Box>
                    <Typography variant="subtitle2" gutterBottom component="div" color="textSecondary">
                        {data?.card_subtitle}
                    </Typography>
                    <RatingLabel rating={data?.rating.value}/>
                </Box>
            </Box>
            <Box sx={{my: 2, p: 2, bgcolor: 'background.paper', borderRadius: '12px'}}>
                <Typography variant="subtitle2" gutterBottom component="div" color="textSecondary">
                    <LinesEllipsis text={data?.recommended_reason} maxLine={3} style={{minHeight: '40px'}}/>
                </Typography>
            </Box>
            <Divider sx={{my: 4}}/>
        </Box>
    );
}

export default ListItem;