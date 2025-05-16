import { useCommonContext as useCommonContextHook } from './useCommonContext';
import { useEmail as useEmailHook } from './useEmail';

namespace CommonHooks {
  export const useCommonContext = useCommonContextHook;
  export const useEmail = useEmailHook;
}

export default CommonHooks;
