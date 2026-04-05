import { useCommonContext } from "./useCommonContext";
import { useEmail } from "./useEmail";

export * as BackendAPI from "./useAPI";
export * as BackendAdminAPI from "./useAdminAPI";
export * as BackendParticipantPortalAPI from "./useParticipantPortalAPI";
export const Common = { useCommonContext, useEmail };
