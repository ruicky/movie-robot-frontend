import ConfirmDialog from "@/components/ConfirmDialog";
import {useDeleteSubDataset} from "@/utils/subscribe";
import message from "@/utils/message";

const DeleteSubTrendingDialog = ({open, onClose, data, onComplete}) => {
    const {trendingType, trendingName} = data;
    const {mutate: deleteSubDataset} = useDeleteSubDataset();
    const onOk = () => {
        deleteSubDataset({
            data_type: 'Trending',
            data_key: trendingType,
        }, {
            onSuccess: res => {
                const {code, message: msg} = res;
                if (code === 0) {
                    message.success(msg);
                    if (onComplete) {
                        onComplete()
                    }
                    onClose();
                } else {
                    message.error(msg);
                    onClose();
                }
            },
            onError: error => message.error(error)
        })
    }
    return (
        <ConfirmDialog open={open} onClose={onClose} title="操作提示" onOk={onOk}
                       content={`确认要取消订阅${trendingName}吗？`}/>
    )
}
export default DeleteSubTrendingDialog;