import {Badge, Card, CardActions, CardContent, Grid, IconButton, Tooltip, Typography} from "@mui/material";
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const RuleItem = ({ruleName, author, description, likeCount, hateCount, liked, hated, onLike, onHate, onInstall}) => {
    return <Card>
        <CardContent>
            <Typography variant="h6" component="div">
                {ruleName}
            </Typography>
            <Typography color="text.secondary">
                由 {author} 分享
            </Typography>
            <Typography variant="body2"  sx={{minHeight:45}}>
                {description}
            </Typography>
        </CardContent>
        <CardActions disableSpacing>
            <Tooltip title="赞一下">
                <IconButton onClick={() => onLike(liked)} disabled={hated}>
                    <Badge badgeContent={likeCount} max={999} anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}>
                        {liked ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                    </Badge>
                </IconButton>
            </Tooltip>
            <Tooltip title="踩一下">
                <IconButton onClick={() => onHate(hated)} disabled={liked}>
                    <Badge badgeContent={hateCount} max={999} anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}>
                        {hated ? <ThumbDownAltIcon/> : <ThumbDownOffAltIcon/>}
                    </Badge>
                </IconButton>
            </Tooltip>
            <Tooltip title="添加到我的订阅">
                <IconButton sx={{marginLeft: "auto"}} onClick={onInstall}>
                    <BookmarkAddIcon/>
                </IconButton>
            </Tooltip>
        </CardActions>
    </Card>;
}
export const ShareRuleList = ({data, onLike, onHate, onInstall}) => {
    return (<Grid spacing={2} container>
        {data && data.map(x => <Grid key={x.id} item xs={12} md={6}>
            <RuleItem
                ruleName={x.ruleName} author={x.authorNickname} description={x.description}
                likeCount={x.likeCount} hateCount={x.hateCount}
                liked={x.liked} hated={x.hated}
                onLike={(cancel) => onLike(cancel, x)} onHate={(cancel) => onHate(cancel, x)}
                onInstall={() => onInstall(x)}
            />
        </Grid>)}
    </Grid>)
}