import type { Context, Config } from "@netlify/functions";
import { authorizeRequest } from "../utils/authorizeRequest.mts";
import { syncProductsToRelewise } from "../utils/syncProductsToRelewise.mts";
import { createVariantsForProduct } from "../utils/createVariantsForProducts.mts";
import { getRelewiseHeaders } from "../utils/getRelewiseHeaders.mts";
import { updateCategoriesWithImage } from "../utils/updateCategoriesWithImages.mts";
import { syncContentToRelewise } from "../utils/syncContentToRelewise.mts";


export const config: Config = {
  path: "/relewise-se/setup-demo-product-data"
};

export default async (req: Request, context: Context) => {

  if (!authorizeRequest(req)) {
    return new Response("Sorry, no access for you.", { status: 401 });
  }

  const { relewise_demo_api, relewise_dataset, relewise_api } = getRelewiseHeaders(req);
  
  const apiKey = typeof relewise_demo_api === "string" && relewise_demo_api.trim() !== ""
  ? relewise_demo_api
  : relewise_api;

  await syncProductsToRelewise(relewise_dataset, apiKey);
  await createVariantsForProduct(relewise_dataset, apiKey);
  await updateCategoriesWithImage(relewise_dataset, apiKey);
  await syncContentToRelewise(relewise_dataset, apiKey);
}