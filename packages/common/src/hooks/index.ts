import BackendAPIHooks from './useAPI';
import { useCommonContext as useCommonContextHook } from './useCommonContext';
import { useEmail as useEmailHook } from './useEmail';

export namespace CommonHooks {
  export const useCommonContext = useCommonContextHook;
  export const useEmail = useEmailHook;
};

namespace Hooks {
  export const Common = CommonHooks;
  export const BackendAPI = BackendAPIHooks;
}

export default Hooks;
