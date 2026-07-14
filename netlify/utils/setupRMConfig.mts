import { setupConfig } from "./setupConfig.mts";

export async function setupRMConfig(relewise_dataset: string, relewise_api: string) {
await setupConfig('RM_Create_DisplayAdTemplate_HERO_BANNER', relewise_dataset, relewise_api);
await setupConfig('RM_Create_DisplayAdTemplate_TILE_BANNER', relewise_dataset, relewise_api);

await setupConfig('RM_Create_Location_PRODUCT_LISTING_PAGE', relewise_dataset, relewise_api);
await setupConfig('RM_Create_Location_SEARCH_RESULTS_PAGE', relewise_dataset, relewise_api);

await setupConfig('RM_Create_Advertiser_APPLE', relewise_dataset, relewise_api);
await setupConfig('RM_Create_Advertiser_DELL', relewise_dataset, relewise_api);
await setupConfig('RM_Create_Advertiser_BOSE', relewise_dataset, relewise_api);
await setupConfig('RM_Create_Advertiser_HUAWEI', relewise_dataset, relewise_api);

await setupConfig('RM_Create_DisplayAd_BOSE_SOUND_CAMPAIGN', relewise_dataset, relewise_api);
await setupConfig('RM_Create_DisplayAd_APPLE_FUTURE_OF_INNOVATION', relewise_dataset, relewise_api);
await setupConfig('RM_Create_DisplayAd_APPLE_AIR_HERO_BANNER', relewise_dataset, relewise_api);
await setupConfig('RM_Create_DisplayAd_HUAWEI_CAMPAIGN', relewise_dataset, relewise_api);

await setupConfig('RM_Create_Campaign_APPLE', relewise_dataset, relewise_api);
await setupConfig('RM_Create_Campaign_DELL', relewise_dataset, relewise_api);
await setupConfig('RM_Create_Campaign_BOSE', relewise_dataset, relewise_api);
await setupConfig('RM_Create_Campaign_HUAWEI', relewise_dataset, relewise_api);
}
