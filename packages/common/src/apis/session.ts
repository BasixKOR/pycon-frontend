import { SessionSchema } from "@frontend/common/schemas/backendSessionAPI";

import { BackendAPIClient } from "./client";

export const sessionList = (client: BackendAPIClient) => async () => {
  return await client.get<SessionSchema[]>("v1/event/presentation/");
};

export const sessionFilteredList = (client: BackendAPIClient, categoryName: string) => async () => {
  return await client.get<SessionSchema[]>(`v1/event/presentation/?category=${categoryName}`);
};
