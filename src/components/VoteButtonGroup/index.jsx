import {Badge, IconButton, Tooltip} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";

export const VoteButtonGroup = ({liked, hated, likeCount, hateCount, onLike, onHate, color="secondary"}) => {
    return <>
        <Tooltip title="赞一下">
            <IconButton onClick={() => onLike(liked)} disabled={hated} color={color}>
                <Badge badgeContent={likeCount} max={999} anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}>
                    {liked ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                </Badge>
            </IconButton>
        </Tooltip>
        <Tooltip title="踩一下">
            <IconButton onClick={() => onHate(hated)} disabled={liked} color={color}>
                <Badge badgeContent={hateCount} max={999} anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}>
                    {hated ? <ThumbDownAltIcon/> : <ThumbDownOffAltIcon/>}
                </Badge>
            </IconButton>
        </Tooltip>
    </>;
}