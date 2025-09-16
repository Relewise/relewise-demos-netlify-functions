import { setupConfig } from "./setupConfig.mts";

export async function setupRelewiseDemoConfig(relewise_dataset: string, relewise_api: string) {
  await setupConfig('search_index_setup', relewise_dataset, relewise_api);
  await setupConfig('synonym_oneway_multilanguage', relewise_dataset, relewise_api);
  await setupConfig('synonym_multidirection_all_lang', relewise_dataset, relewise_api);
  await setupConfig('merch_pin_insurance_on_laptops', relewise_dataset, relewise_api);
  await setupConfig('merch_boost_newly_listed_products', relewise_dataset, relewise_api);
  await setupConfig('merch_boost_low_stock_tbd_products', relewise_dataset, relewise_api);
  await setupConfig('merch_boost_high_margin_products_b2c', relewise_dataset, relewise_api);
  await setupConfig('merch_boost_high_margin_products_b2b', relewise_dataset, relewise_api);
  await setupConfig('merch_bargain_hunter_boost', relewise_dataset, relewise_api);
  await setupConfig('merch_boost_Upsell_Brand_In_Basket', relewise_dataset, relewise_api);
  await setupConfig('merch_boost_within_same_category_accessories', relewise_dataset, relewise_api);
  await setupConfig('merch_filter_when_viewing_accessories', relewise_dataset, relewise_api);
  await setupConfig('merch_boost_onsale_if_buying_onsale_product', relewise_dataset, relewise_api);
  await setupConfig('merch_boost_apple_products_for_fanboys', relewise_dataset, relewise_api);
  await setupConfig('merch_boost_hue_for_dk_se', relewise_dataset, relewise_api);
  await setupConfig('setup_redirect_rule_help', relewise_dataset, relewise_api);
}
