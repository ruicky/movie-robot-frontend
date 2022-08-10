import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subscribeList: [], // 选中的订阅数据
  multipleChoiceModalOpen: false // 弹框状态
}

export const multipleChoiceSlice = createSlice(({
  name: "multipleChoiceSlice",
  initialState,
  reducers: {
    setSubscribeList(state, action) {
      state.subscribeList = action.payload;
    },
    openMutipleChoiceModal(state) {
      state.multipleChoiceModalOpen = true;
    },
    closeMutipleChoiceModal(state) {
      state.multipleChoiceModalOpen = false;
      state.subscribeList = [];
    },
  }
}))



// 返回当前节点下多选组件的弹框显示状态
export const selectMultipleChoiceModalOpen = state => state.multipleChoice.multipleChoiceModalOpen;

// 导出选中的个数
export const selectCheckLength = state => state.multipleChoice.subscribeList.length;

// 导出列表
export const selectSubscribeList= state => state.multipleChoice.subscribeList;

// 导出 actions
export const multipleChoiceActions = multipleChoiceSlice.actions;

export default multipleChoiceSlice.reducer;