import type { Context, Config } from "@netlify/functions";
import { authorizeRequest } from "../utils/authorizeRequest.mts";
import { getRelewiseHeaders } from "../utils/getRelewiseHeaders.mts";
import { pushBaseOrdersToDemo } from "../utils/pushBaseOrdersToDemo.mts";


export const config: Config = {
  path: "/relewise-se/setup-demo-base-orders"
};

export default async (req: Request, context: Context) => {

  if (!authorizeRequest(req)) {
    return new Response("Sorry, no access for you.", { status: 401 });
  }

  const { relewise_demo_api, relewise_dataset, relewise_api } = getRelewiseHeaders(req);
  
  const apiKey = typeof relewise_demo_api === "string" && relewise_demo_api.trim() !== ""
  ? relewise_demo_api
  : relewise_api;

  await pushBaseOrdersToDemo(relewise_dataset, apiKey);
}

