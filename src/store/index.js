import create from 'zustand'
import produce from 'immer'
import { isUndefined } from 'lodash-es';

export const useStore = create(set => ({
    theme: {
        isOpen: false,
        toggle: (status) => set(produce(state => {
            state.theme.isOpen = isUndefined(status) ? !state.theme.isOpen : status
        }))
    },
    sideBar: {
        isOpen: false,
        toggleOpen: (status) => set(produce(state => {
            state.sideBar.isOpen = isUndefined(status) ? !state.sideBar.isOpen : status
        }))
    }
}))
export default useStore