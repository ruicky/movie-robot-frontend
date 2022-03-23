import create from 'zustand'
import produce from 'immer'
import _ from 'lodash';

export const useStore = create(set => ({
    theme:{
        isOpen:false,
        toggle:(status)=>set(produce(state=>{
            state.theme.isOpen = _.isUndefined(status)?!state.theme.isOpen:status
        }))
    }
}))
export default useStore