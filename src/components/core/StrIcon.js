import * as m_icon from "@mui/icons-material";
import * as f_icon from "react-feather";
import { get as _get } from "lodash-es";

export const StrIcon = ({ iconName }) => {
    return _get({
        ...m_icon,
        ...f_icon
    }, iconName, null)
}