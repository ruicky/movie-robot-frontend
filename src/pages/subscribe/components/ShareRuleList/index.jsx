import {Box, Card, CardContent, CardMedia as MuiCardMedia, Grid, IconButton, Tooltip, Typography} from "@mui/material";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import {VoteButtonGroup} from "@/components/VoteButtonGroup";
import {styled} from '@mui/material/styles';

const Poster = styled(MuiCardMedia)((props) =>({
    [props.theme.breakpoints.up('md')]: {
        height: 225,
        width: 150,
    },
    height: 160,
    width: 110,
    borderRadius: '8px',
    padding: 4
}));
const RuleItem = ({
                      posterUrl,
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
    return <Card sx={{display: 'flex'}}>
        <Poster
            component="img"
            image={posterUrl}
        />
        <Box sx={{display: 'flex', flexDirection: 'column', width: 1}}>
            <CardContent>
                <Typography variant="h6" component="div">
                    {ruleName}
                </Typography>
                <Typography color="text.secondary">
                    由 {author} 分享
                </Typography>
                <Typography variant="body2">
                    {description}
                </Typography>
            </CardContent>
            <Box sx={{display: 'flex', marginTop: 'auto', p: 1}}>
                <VoteButtonGroup hated={hated} liked={liked} hateCount={hateCount} likeCount={likeCount} onHate={onHate}
                                 onLike={onLike}/>
                <Tooltip title="添加到我的订阅">
                    <IconButton sx={{marginLeft: "auto"}} onClick={onInstall}>
                        <BookmarkAddIcon/>
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    </Card>;
}
export const ShareRuleList = ({data, onLike, onHate, onInstall, multipleColumns = true}) => {
    return (<Grid spacing={2} container>
        {data && data.map(x => <Grid key={x.id} item xs={12} md={multipleColumns ? 6 : 12}>
            <RuleItem
                posterUrl={x.posterUrl}
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
