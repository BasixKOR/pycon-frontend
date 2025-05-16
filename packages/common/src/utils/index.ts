import { getCookie as _getCookie } from "./cookie";
import {
  getFormValue as _getFormValue,
  isFormValid as _isFormValid,
} from "./form";

namespace Utils {
  export const getCookie = _getCookie;
  export const isFormValid = _isFormValid;
  export const getFormValue = _getFormValue;
}

export default Utils;
