import * as R from "remeda";

import {
  buildNestedSiteMap as _buildNestedSiteMap,
  findSiteMapUsingRoute as _findSiteMapUsingRoute,
  parseCss as _parseCss,
} from "./api";
import { getCookie as _getCookie } from "./cookie";
import {
  getFormValue as _getFormValue,
  isFormValid as _isFormValid,
} from "./form";
import {
  filterReadOnlyPropertiesInJsonSchema as _filterReadOnlyPropertiesInJsonSchema,
  filterWritablePropertiesInJsonSchema as _filterWritablePropertiesInJsonSchema,
} from "./json_schema";

namespace Utils {
  export const buildNestedSiteMap = _buildNestedSiteMap;
  export const findSiteMapUsingRoute = _findSiteMapUsingRoute;
  export const parseCss = _parseCss;
  export const getCookie = _getCookie;
  export const isFormValid = _isFormValid;
  export const getFormValue = _getFormValue;
  export const isFilledString = (obj: unknown): obj is string =>
    R.isString(obj) && !R.isEmpty(obj);
  export const filterWritablePropertiesInJsonSchema =
    _filterWritablePropertiesInJsonSchema;
  export const filterReadOnlyPropertiesInJsonSchema =
    _filterReadOnlyPropertiesInJsonSchema;
}

export default Utils;
