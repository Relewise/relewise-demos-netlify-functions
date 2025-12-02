import { Trackable, DataValueFactory } from "@relewise/client";
import { Integrator, ProductUpdateBuilder } from "@relewise/integrations";
import { ProductData } from "../../src/types/product.mts";
import { sanityClient } from "./sanityClient.mts";

export async function syncProductsToRelewise(relewise_dataset: string, relewise_api: string) {
  const allProductsToSync: ProductData[] = await sanityClient.fetch<ProductData[]>("*[_type == 'relewiseProduct'] {unique_id, brand -> {id, 'displayName':name}, name[] {'language': lower(_key), 'name': value} , availability[] {'language': lower(_key), 'number': value} ,mainCategory -> {id, name[]{'language': lower(_key), 'displayName': value}, 'subCategory': ^.prodSubcategories-> {id, name[]{'language': lower(_key), 'displayName': value}}}, list_price[] {'currency': select(^.currency[_key == ^._key][0].value), 'amount':value}, sales_price[] {'currency': select(^.currency[_key == ^._key][0].value), 'amount':value}, description[] {'language': lower(_key), 'text':value}, margin, image, markets, channels, daysAvailable, salesStatus, lowStock[]{'language':_key, value}, promoted[]{'language':_key, value}, soldOut[]{'language':_key, value}, campaignIds, OnSale[]{'language':_key, value}}");

  const integrator = new Integrator(
    relewise_dataset,
    relewise_api,
    {
      serverUrl: Netlify.env.get('RELEWISE_SERVER_URL'),
    });

  const date: number = Date.now();
  const productUpdates: Trackable[] = [];

  allProductsToSync.forEach(product => {
    try {
      console.log(product.unique_id);
      const content = new ProductUpdateBuilder({
        id: product.unique_id.toString(),
        productUpdateKind: 'UpdateAndAppend',
      })
        .brand({ id: product.brand.id, displayName: product.brand.displayName })
        .categoryPaths(cat => cat
          .path(catPath => catPath
            .category({
              id: product.mainCategory.id,
              displayName: product.mainCategory.name
                .map(element => (
                  { value: element.displayName, language: element.language }
                ))
            })
            .category({
              id: product.mainCategory.subCategory?.id,
              displayName: product.mainCategory.subCategory?.name
                .map(element => (
                  { value: element.displayName, language: element.language }
                ))
            })
          ))
        .displayName(product.name.map(element => ({ language: element.language, value: element.name })))
        .listPrice(product.list_price.map(element => ({ amount: element.amount, currency: element.currency })))
        .salesPrice(product.sales_price.map(element => ({ amount: element.amount as number, currency: element.currency })))
        .data(
          {
            'Description': DataValueFactory.multilingual(product.description.map(element => ({ language: element.language, value: element.text }))),
            'ImageUrl': DataValueFactory.string(product.image.replace("upload/", "upload/c_scale,h_0.5,w_0.5/q_auto:low/")),
            ...product.availability.reduce((acc: any, element) => {
              acc[element.language + '_StockLevel'] = DataValueFactory.number(element.number);

              if (!acc["SoldOut"]) {
                acc["SoldOut"] = DataValueFactory.multilingual([]);
              }

              acc["SoldOut"].value.values.push({ language: { value: element.language }, text: String(element.number === 0) }); //If availability is 0 - set SoldOut to true

              if (!acc["LowStock"]) {
                acc["LowStock"] = DataValueFactory.multilingual([]);
              }
              acc["LowStock"].value.values.push({ language: { value: element.language }, text: String(element.number <= 3) }); //if availability is less than or equal to 3 - set LowSTock to true

              return acc;
            }, {}),
            ...(product.promoted ? { 'Promoted': DataValueFactory.multilingual(product.promoted.map(element => ({ language: element.language, value: String(element.value) }))) } : {}), ...(product.promoted ? {
              'Promoted': DataValueFactory.multilingual(
                product.promoted.map(element => ({
                  language: element.language,
                  value: element.value === true ? "true" : "false"
                }))
              )
            } : {}),
            ...(product.campaignIds ? { 'campaignIds': DataValueFactory.stringCollection(product.campaignIds) } : {}),
            ...(product.margin ? { 'Margin': DataValueFactory.string(product.margin) } : {}),
            ...(product.markets ? { 'AvailableInMarkets': DataValueFactory.stringCollection(product.markets) } : {}),
            ...(product.channels ? { 'AvailableInChannels': DataValueFactory.stringCollection(product.channels) } : {}),
            ...(product.daysAvailable ? { 'DaysAvailable': DataValueFactory.number(product.daysAvailable) } : {}),
            ...(product.salesStatus ? { 'SalesStatus': DataValueFactory.string(product.salesStatus) } : {}),
            ...(product.OnSale ? { 'OnSale': DataValueFactory.multilingual(product.OnSale.map(element => ({ language: element.language, value: String(element.value) }))) } : {}),
            'ImportedAt': DataValueFactory.number(date),
          }
        );

      productUpdates.push(content.build());
    } catch (error) {
      console.log(error);
    }

  });

  await integrator.batch(productUpdates);
}
