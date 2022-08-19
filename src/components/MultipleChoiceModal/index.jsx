import React from 'react';
import { Box, Drawer, Typography } from "@mui/material";
import {
  CloseOutlined as CloseOutlinedIcon,
  MoreHoriz as MoreHorizIcon
} from '@mui/icons-material';
import styled from "styled-components/macro";
import { useDispatch, useSelector } from "react-redux";
import {
  multipleChoiceActions,
  selectCheckLength,
  selectMultipleChoiceModalOpen
} from "@/redux/slices/multiple-choice.slice";
import ChoiceMenu from "@/components/MultipleChoiceModal/ChoiceMenu";

const MultipleChoiceModal = () => {
  const isShowModal = useSelector(selectMultipleChoiceModalOpen);
  const checkedLength = useSelector(selectCheckLength);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Drawer anchor="bottom" open={isShowModal} variant="persistent">
      <BoxWrapper sx={{ mx: 1 }}>
        <CloseOutlinedIcon
          aria-label="关闭"
          onClick={() =>
            dispatch(multipleChoiceActions.closeMutipleChoiceModal())
          }
        />
        <Typography variant="button">已选择{checkedLength}项</Typography>
        <MoreHorizIcon
          onClick={handleMenuClick}
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        />
      </BoxWrapper>
      <ChoiceMenu
        aria-label="更多"
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
      />
    </Drawer>
  );
};

const BoxWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 30px auto 30px;
  justify-items: center;
  align-items: center;
  height: 50px;
`;

export default MultipleChoiceModal;