import {Card, CardActions, CardContent, Grid, IconButton, Tooltip, Typography} from "@mui/material";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import {VoteButtonGroup} from "@/components/VoteButtonGroup";

const RuleItem = ({
                      ruleName,
                      author,
                      description,
                      likeCount,
                      hateCount,
                      liked,
                      hated,
                      onLike,
                      onHate,
                      onInstall,
                      multipleColumns = true
                  }) => {
    return <Card>
        <CardContent>
            <Typography variant="h6" component="div">
                {ruleName}
            </Typography>
            <Typography color="text.secondary">
                由 {author} 分享
            </Typography>
            <Typography variant="body2" sx={{minHeight: multipleColumns ? 45 : null}}>
                {description}
            </Typography>
        </CardContent>
        <CardActions disableSpacing>
            <VoteButtonGroup hated={hated} liked={liked} hateCount={hateCount} likeCount={likeCount} onHate={onHate}
                             onLike={onLike}/>
            <Tooltip title="添加到我的订阅">
                <IconButton sx={{marginLeft: "auto"}} onClick={onInstall}>
                    <BookmarkAddIcon/>
                </IconButton>
            </Tooltip>
        </CardActions>
    </Card>;
}
export const ShareRuleList = ({data, onLike, onHate, onInstall, multipleColumns = true}) => {
    return (<Grid spacing={2} container>
        {data && data.map(x => <Grid key={x.id} item xs={12} md={multipleColumns ? 6 : 12}>
            <RuleItem
                ruleName={x.ruleName} author={x.authorNickname} description={x.description}
                likeCount={x.likeCount} hateCount={x.hateCount}
                liked={x.liked} hated={x.hated}
                onLike={(cancel) => onLike(cancel, x)} onHate={(cancel) => onHate(cancel, x)}
                onInstall={() => onInstall(x)}
                multipleColumns={multipleColumns}
            />
        </Grid>)}
    </Grid>)
}