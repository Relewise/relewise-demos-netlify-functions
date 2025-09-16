import type { Context, Config } from "@netlify/functions";
import { authorizeRequest } from "../utils/authorizeRequest.mts";
import { setupRelewiseDemoConfig } from "../utils/setupRelewiseDemoConfig.mts";
import { setupRMConfig } from "../utils/setupRMConfig.mts";
import { getRelewiseHeaders } from "../utils/getRelewiseHeaders.mts";

export const config: Config = {
  path: "/relewise-se/configure-demo"
};

export default async (req: Request, context: Context) => {

  if (!authorizeRequest(req)) {
    return new Response("Sorry, no access for you.", { status: 401 });
  }
  const { relewise_api, relewise_dataset } = getRelewiseHeaders(req);

  await setupRelewiseDemoConfig(relewise_dataset, relewise_api);
  await setupRMConfig(relewise_dataset, relewise_api);
}