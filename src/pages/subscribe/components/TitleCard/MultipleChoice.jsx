import React from 'react';
import { Box } from "@mui/material";
import { CheckCircleRounded as CheckCircleRoundedIcon, Circle as CircleIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { selectSubscribeList, multipleChoiceActions } from "@/redux/slices/multiple-choice.slice";
import { clone as _clone, includes as _includes, remove as _remove } from 'lodash'

const MultipleChoice = ({id}) => {
  const dispatch = useDispatch();
  // 通过 useSelector 可以查询全局的值
  const subscribeList = useSelector(selectSubscribeList);
  const isCheck = subscribeList.filter(x => x === id).length > 0;

  const handleCheck = () => {
    let list = _clone(subscribeList)

    if(!_includes(subscribeList, id)) {
      list.push(id)
    } else {
      _remove(list, x=> x===id)
    }
    // 赋值给 list
    dispatch(multipleChoiceActions.setSubscribeList(list))
    // 触发打开全局 modal 的布尔值
    dispatch(multipleChoiceActions.openMutipleChoiceModal())
  }

  return (
    <Box>
      {
        isCheck
          ? <CheckCircleRoundedIcon onClick={handleCheck} sx={{m:1, color: '#49c165'}} />
          : <CircleIcon onClick={handleCheck} sx={{m:1, color: 'rgba(255,255,255,.4)', position: 'absolute'}} />
      }
    </Box>
  )
}

export default MultipleChoice;