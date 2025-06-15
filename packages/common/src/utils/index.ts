import { buildFlatSiteMap as _buildFlatSiteMap, buildNestedSiteMap as _buildNestedSiteMap, parseCss as _parseCss } from "./api";
import { getCookie as _getCookie } from "./cookie";
import { getFormValue as _getFormValue, isFormValid as _isFormValid } from "./form";
import {
  filterPropertiesByLanguageInJsonSchema as _filterPropertiesByLanguageInJsonSchema,
  filterReadOnlyPropertiesInJsonSchema as _filterReadOnlyPropertiesInJsonSchema,
  filterWritablePropertiesInJsonSchema as _filterWritablePropertiesInJsonSchema,
} from "./json_schema";
import { isFilledString as _isFilledString, isValidHttpUrl as _isValidHttpUrl, rtrim as _rtrim } from "./string";

namespace Utils {
  export const buildFlatSiteMap = _buildFlatSiteMap;
  export const buildNestedSiteMap = _buildNestedSiteMap;
  export const parseCss = _parseCss;
  export const getCookie = _getCookie;
  export const isFormValid = _isFormValid;
  export const getFormValue = _getFormValue;
  export const isFilledString = _isFilledString;
  export const isValidHttpUrl = _isValidHttpUrl;
  export const rtrim = _rtrim;
  export const filterWritablePropertiesInJsonSchema = _filterWritablePropertiesInJsonSchema;
  export const filterReadOnlyPropertiesInJsonSchema = _filterReadOnlyPropertiesInJsonSchema;
  export const filterPropertiesByLanguageInJsonSchema = _filterPropertiesByLanguageInJsonSchema;
}

export default Utils;
