import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {Box, CardActionArea, Chip, IconButton, Tooltip} from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import HelpIcon from '@mui/icons-material/Help';
import GitHubIcon from '@mui/icons-material/GitHub';
import {styled} from "@mui/material/styles";
import DeleteIcon from '@mui/icons-material/Delete';

const Flag = styled("div")`
    position: absolute;
    height: 20px;
    line-height: 20px;
    text-align: center;
    width: 74px;
    background-color: #FF5722;
    color: #fff;
    -moz-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    left: -18px;
    top: 9px;
`;
export const PluginItem = ({
                               name, desc, authorNickname, version, imageUrl, installed, githubUrl, docUrl
                           }) => {
    return (
        <Card>
            <CardActionArea>
                <CardMedia
                    sx={{
                        height: 235
                    }}
                    image={imageUrl}
                    alt="插件"
                >
                    {installed && <Flag>已安装</Flag>}
                    {version && <Chip
                        size={"small"}
                        sx={{
                            position: "absolute",
                            background: "#FFAC2F",
                            color: "#000000",
                            borderRadius: 50,
                            fontSize: "11px",
                            right: 6,
                            top: 6
                        }}
                        label={version}/>}
                </CardMedia>
                <CardContent>
                    {name && <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>}
                    {desc && <Typography variant="body2" color="text.secondary">
                        {desc}
                    </Typography>}
                    {authorNickname && <Typography variant="caption">
                        由 {authorNickname} 开发
                    </Typography>}
                </CardContent>
            </CardActionArea>
            <Box sx={{display: 'flex', marginTop: 'auto', p: 2}}>
                {githubUrl && <Tooltip title="查看源代码">
                    <IconButton component="a" target="_blank" href={githubUrl}>
                        <GitHubIcon/>
                    </IconButton>
                </Tooltip>}
                <Tooltip title="帮助文档">
                    <IconButton component="a" target="_blank" href={docUrl}>
                        <HelpIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={installed ? "卸载插件" : "安装插件"}>
                    <IconButton sx={{marginLeft: "auto"}}>
                        {installed ? <DeleteIcon/> : <GetAppIcon/>}
                    </IconButton>
                </Tooltip>
            </Box>
        </Card>
    );
}