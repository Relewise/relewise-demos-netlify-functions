import { Trackable, DataValueFactory } from "@relewise/client";
import { ContentUpdateBuilder, Integrator } from "@relewise/integrations";
import { sanityClient } from "./sanityClient.mts";
import { ContentData } from "../../src/types/ContentData.mts";

export async function syncContentToRelewise(relewise_dataset: string, relewise_api: string) {
  const allContentToSync: ContentData[] = await sanityClient.fetch<ContentData[]>("*[_type == 'blogPost' && !(_id in path('drafts.**'))] {'unique_id': _id, headline[] {'language': lower(_key), 'text': value}, summary[] {'language': lower(_key), 'text': value}, body[] {'language': lower(_key), 'text': value}, byline[] {'language': lower(_key), 'text': value}, mainCategory -> {id, name[]{'language': lower(_key), 'displayName': value}, 'subCategory': ^.prodSubcategories-> {id, name[]{'language': lower(_key), 'displayName': value}}}, relevant_products[] {'productId': _ref}, image, 'brand': relevant_products[0] -> brand -> name}");

  const integrator = new Integrator(
    relewise_dataset,
    relewise_api,
    {
      serverUrl: Netlify.env.get('RELEWISE_SERVER_URL'),
    });

  const date: number = Date.now();
  const contentUpdates: Trackable[] = [];

  allContentToSync.forEach(blog => {
    try {
      console.log(blog.unique_id);
      const content = new ContentUpdateBuilder({
        id: blog.unique_id.toString(),
        updateKind: 'UpdateAndAppend',
      })
        // .brand({ id: product.brand.id, displayName: product.brand.displayName })
        .categoryPaths(cat => cat
          .path(catPath => catPath
            .category({
              id: blog.mainCategory.id,
              displayName: blog.mainCategory.name
                .map(element => (
                  { value: element.displayName, language: element.language }
                ))
            })
            .category({
              id: blog.mainCategory.subCategory?.id,
              displayName: blog.mainCategory.subCategory?.name
                .map(element => (
                  { value: element.displayName, language: element.language }
                ))
            })
          ))
        .displayName(blog.headline.map(element => ({ language: element.language, value: element.text })))

        .data(
          {
            'Summary': DataValueFactory.multilingual(blog.summary.map(element => ({ language: element.language, value: element.text }))),
            'Body': DataValueFactory.multilingual(blog.body.map(element => ({ language: element.language, value: element.text }))),
            'ByLine': DataValueFactory.multilingual(blog.byline.map(element => ({ language: element.language, value: element.text }))),
            'Relevant_Products': DataValueFactory.stringCollection(blog.relevant_products.map(element =>(element.productId))),
            'Brand': DataValueFactory.string(blog.brand),
            'Image': DataValueFactory.string(blog.image.replace("upload/", "upload/c_scale,h_0.5,w_0.5/q_auto:low/")),
            'ImportedAt': DataValueFactory.number(date),
          }
        );

        contentUpdates.push(content.build());
    } catch (error) {
      console.log(error);
    }

  });

  await integrator.batch(contentUpdates);
}
