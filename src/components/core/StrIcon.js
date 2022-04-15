import * as m_icon from "@mui/icons-material";
import * as f_icon from "react-feather";
import _ from "lodash";

export const StrIcon = ({iconName}) => {
    console.log(iconName)
    return _.get({
        ...m_icon,
        ...f_icon
    }, iconName, null)
}