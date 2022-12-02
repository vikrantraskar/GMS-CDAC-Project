import { useNavigate } from "react-router-dom";
import CommonSpinner from "../components/common_spinner";

export const showCommonSpinner = (flag) => {
    return flag ? <CommonSpinner /> : null;
}

