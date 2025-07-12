import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import BackendAPIHooks from "./useAPI";
import { BackendAPIClient } from "../apis/client";
import ParticipantPortalAPI from "../apis/participant_portal_api";

const QUERY_KEYS = {
  PARTICIPANT_ME: ["query", "participant", "me"],
  PARTICIPANT_PUBLIC_FILES: ["query", "participant", "list", "public-file"],
  PARTICIPANT_LIST_PRESENTATION: ["query", "participant", "list", "presentation"],
  PARTICIPANT_RETRIEVE_PRESENTATION: ["query", "participant", "retrieve", "presentation"],
  PARTICIPANT_LIST_MODIFICATION_AUDIT: ["query", "participant", "list", "modification-audit"],
  PARTICIPANT_RETRIEVE_MODIFICATION_AUDIT: ["query", "participant", "retrieve", "modification-audit"],
};

const MUTATION_KEYS = {
  PARTICIPANT_SIGN_IN: ["mutation", "participant", "sign-in"],
  PARTICIPANT_SIGN_OUT: ["mutation", "participant", "sign-out"],
  PARTICIPANT_CHANGE_PASSWORD: ["mutation", "participant", "change-password"],
  PARTICIPANT_UPDATE_ME: ["mutation", "participant", "update-me"],
  PARTICIPANT_UPLOAD_PUBLIC_FILE: ["mutation", "participant", "public-file", "upload"],
  PARTICIPANT_UPDATE_PRESENTATION: ["mutation", "participant", "update", "presentation"],
  PARTICIPANT_CANCEL_MODIFICATION_AUDIT: ["mutation", "participant", "cancel", "modification-audit"],
};

namespace BackendParticipantPortalAPIHooks {
  export const useParticipantPortalClient = () => {
    const { backendApiDomain, backendApiTimeout, backendApiCSRFCookieName, language } = BackendAPIHooks.useBackendContext();
    return new BackendAPIClient(backendApiDomain, backendApiTimeout, backendApiCSRFCookieName, true, language);
  };

  export const useSignedInUserQuery = (client: BackendAPIClient) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.PARTICIPANT_ME, client.language],
      queryFn: ParticipantPortalAPI.me(client),
    });

  export const usePreviewMeModAuditQuery = (client: BackendAPIClient) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.PARTICIPANT_ME, "preview", client.language],
      queryFn: ParticipantPortalAPI.previewMeModAudit(client),
    });

  export const useUpdateMeMutation = (client: BackendAPIClient) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.PARTICIPANT_UPDATE_ME],
      mutationFn: ParticipantPortalAPI.updateMe(client),
    });

  export const useSignInMutation = (client: BackendAPIClient) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.PARTICIPANT_SIGN_IN],
      mutationFn: ParticipantPortalAPI.signIn(client),
    });

  export const useSignOutMutation = (client: BackendAPIClient) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.PARTICIPANT_SIGN_OUT],
      mutationFn: ParticipantPortalAPI.signOut(client),
    });

  export const useChangePasswordMutation = (client: BackendAPIClient) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.PARTICIPANT_CHANGE_PASSWORD],
      mutationFn: ParticipantPortalAPI.changePassword(client),
    });

  export const usePublicFilesQuery = (client: BackendAPIClient) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.PARTICIPANT_PUBLIC_FILES, client.language],
      queryFn: ParticipantPortalAPI.listPublicFiles(client),
    });

  export const useUploadPublicFileMutation = (client: BackendAPIClient) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.PARTICIPANT_UPLOAD_PUBLIC_FILE, "upload"],
      mutationFn: ParticipantPortalAPI.uploadPublicFile(client),
    });

  export const useListPresentationsQuery = (client: BackendAPIClient) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.PARTICIPANT_LIST_PRESENTATION, client.language],
      queryFn: ParticipantPortalAPI.listPresentations(client),
    });

  export const useRetrievePresentationQuery = (client: BackendAPIClient, id: string) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.PARTICIPANT_RETRIEVE_PRESENTATION, id, client.language],
      queryFn: ParticipantPortalAPI.retrievePresentation(client, id),
    });

  export const useUpdatePresentationMutation = (client: BackendAPIClient) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.PARTICIPANT_UPDATE_PRESENTATION],
      mutationFn: ParticipantPortalAPI.patchPresentation(client),
    });

  export const usePreviewPresentationModAuditQuery = (client: BackendAPIClient, id: string) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.PARTICIPANT_RETRIEVE_PRESENTATION, id, "preview", client.language],
      queryFn: ParticipantPortalAPI.previewPresentationModAudit(client, id),
    });

  export const useModificationAuditsQuery = (client: BackendAPIClient) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.PARTICIPANT_LIST_MODIFICATION_AUDIT, client.language],
      queryFn: ParticipantPortalAPI.listModificationAudits(client),
    });

  export const useModificationAuditPreviewQuery = (client: BackendAPIClient, id: string) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.PARTICIPANT_LIST_MODIFICATION_AUDIT, "preview", id, client.language],
      queryFn: ParticipantPortalAPI.previewModificationAudit(client, id),
    });

  export const useRetrieveModificationAuditQuery = (client: BackendAPIClient, id: string) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.PARTICIPANT_RETRIEVE_MODIFICATION_AUDIT, id, client.language],
      queryFn: ParticipantPortalAPI.retrieveModificationAudit(client, id),
    });

  export const useCancelModificationAuditMutation = (client: BackendAPIClient) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.PARTICIPANT_CANCEL_MODIFICATION_AUDIT],
      mutationFn: ParticipantPortalAPI.cancelModificationAudit(client),
    });
}

export default BackendParticipantPortalAPIHooks;
