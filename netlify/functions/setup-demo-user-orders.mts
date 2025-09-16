import type { Context, Config } from "@netlify/functions";
import { authorizeRequest } from "../utils/authorizeRequest.mts";
import { getRelewiseHeaders } from "../utils/getRelewiseHeaders.mts";
import { AddUserOrders } from "../utils/addUserOrders.mts";


export const config: Config = {
  path: "/relewise-se/setup-demo-user-orders"
};

export default async (req: Request, context: Context) => {

  if (!authorizeRequest(req)) {
    return new Response("Sorry, no access for you.", { status: 401 });
  }


  const { relewise_api, relewise_dataset, relewise_demo_api } = getRelewiseHeaders(req);

  const apiKey = typeof relewise_demo_api === "string" && relewise_demo_api.trim() !== ""
  ? relewise_demo_api
  : relewise_api;

  await AddUserOrders(relewise_dataset, apiKey);
}

