import { BackendAPIClient } from "./client";
import BackendSessionAPISchemas from "../schemas/backendSessionAPI";

namespace SessionAPIs {
  export const sessionList = (client: BackendAPIClient) => async () => {
    return await client.get<BackendSessionAPISchemas.SessionSchema[]>("v1/event/presentation/");
  };

  export const sessionFilteredList = (client: BackendAPIClient, categoryName: string) => async () => {
    return await client.get<BackendSessionAPISchemas.SessionSchema[]>(
      `v1/event/presentation/?category=${categoryName}`
    );
  };
}

export default SessionAPIs;
