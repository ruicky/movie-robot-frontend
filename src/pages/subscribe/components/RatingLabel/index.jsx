import styled from "styled-components/macro";
import {Rating} from "@mui/material";
import React from "react";

const RatingContainer = styled.div`
  display: flex;
  
  align-items: center;
  justify-content:center;
`;
const RatingLabel = ({rating}) => {
    return (
        <RatingContainer>
            {rating
                ? <><Rating
                    name="read-only"
                    size="small"
                    precision={0.5}
                    value={Math.floor(rating / 2)}
                    readOnly/>
                    <span style={{marginLeft: '2px', color: '#e09015'}}>{rating}</span>
                </>
                : "暂无评分"
            }
        </RatingContainer>
    )
}
export default RatingLabel;