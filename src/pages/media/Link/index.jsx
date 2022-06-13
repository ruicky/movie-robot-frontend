import {Helmet} from "react-helmet-async";
import {Card, CardContent, Divider, FormControl, Grid, MenuItem, Paper, Select, Typography} from "@mui/material";
import React, {useState} from "react";
import PathSelectDialog from "@/components/PathSelectDialog";
import MediaTable from "@/pages/media/Link/MeidaTable";


function Index() {
    const [mediaType, setMediaType] = useState('Movie');
    const [sourcePath, setSourcePath] = useState('');
    const [linkPath, setLinkPath] = useState('');
    return (
        <>
            <Helmet title="本地资源管理"/>
            <Typography variant="h3" gutterBottom>
                本地资源管理
            </Typography>
            <Divider my={4}/>
            <Grid container my={2} spacing={1}>
                <Grid item md={1} xs={3}>
                    <FormControl fullWidth>
                        <Select
                            name="type"
                            value={mediaType}
                            displayEmpty
                            onChange={(e) => setMediaType(e.target.value)}
                        >
                            <MenuItem value="Movie">电影</MenuItem>
                            <MenuItem value="TV">剧集</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={5.5} xs={9}>
                    <PathSelectDialog
                        title="点击选择媒体路径" placeholder="点击选择媒体路径"
                        onChange={(value) => setSourcePath(value)}
                    />
                </Grid>
                <Grid item md={5.5} xs={12}>
                    <PathSelectDialog
                        title="点击选择整理后路径" placeholder="点击选择整理后路径"
                        onChange={(value) => setLinkPath(value)}
                    />
                </Grid>
            </Grid>
            <Card mb={6}>
                <CardContent pb={1}>
                    <Typography variant="h6" gutterBottom>
                        待整理{mediaType === "Movie" ? "电影" : "剧集"}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        选择媒体路径后，可以加载该路径下待处理的影视资源。通过选个单个或全选资源，作出整理操作。
                    </Typography>
                </CardContent>
                <Paper>
                    <MediaTable path={sourcePath} linkPath={linkPath}/>
                </Paper>
            </Card>
        </>
    );
}

export default Index;