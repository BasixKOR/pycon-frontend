import { BackendAPIClient } from "./client";
import * as BackendSessionAPISchemas from "../schemas/backendSessionAPI";

export const sessionList = (client: BackendAPIClient) => async () => {
  return await client.get<BackendSessionAPISchemas.SessionSchema[]>("v1/event/presentation/");
};

export const sessionFilteredList = (client: BackendAPIClient, categoryName: string) => async () => {
  return await client.get<BackendSessionAPISchemas.SessionSchema[]>(`v1/event/presentation/?category=${categoryName}`);
};
