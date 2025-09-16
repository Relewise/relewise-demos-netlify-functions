import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  apiVersion: "v2024-05-23",
  dataset: Netlify.env.get("SANITY_DATASET"),
  projectId: Netlify.env.get("SANITY_PROJECT_ID"),
  token: Netlify.env.get("SANITY_TOKEN"),
  useCdn: false,
});
