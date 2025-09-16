import { setupConfig } from "./setupConfig.mts";

export async function setupRMConfig(relewise_dataset: string, relewise_api: string) {
  await setupConfig('RM_Create_Location_PRODUCT_LISTING_PAGE', relewise_dataset, relewise_api);
  await setupConfig('RM_Create_Location_SEARCH_RESULTS_PAGE', relewise_dataset, relewise_api);
  await setupConfig('RM_Create_Advertiser_APPLE', relewise_dataset, relewise_api);
  await setupConfig('RM_Create_Advertiser_DELL', relewise_dataset, relewise_api);
  await setupConfig('RM_Create_Campaign_APPLE', relewise_dataset, relewise_api);
  await setupConfig('RM_Create_Campaign_DELL', relewise_dataset, relewise_api);
}
