import { Integrator, ProductCategoryUpdateBuilder } from "@relewise/integrations";
import { sanityClient } from "./sanityClient.mts";
import { DataValueFactory, Trackable } from "@relewise/client";

export async function updateCategoriesWithImage(relewise_dataset: string, relewise_api: string) {
    //This function needs to be separate, as we cannot add additional data via the "normal" update to categories. 
    const allCategories = await sanityClient.fetch("*[_type == 'relewiseCategory' || _type=='relewiseSubCategory'] {id, name[]{'language': lower(_key), 'displayName': value}, image}");
    const integrator = new Integrator(relewise_dataset, relewise_api, {
        serverUrl: Netlify.env.get('RELEWISE_SERVER_URL')
    });
    const date = Date.now();
    const categoryUpdates: Trackable[] = [];
    allCategories.forEach(category => {
        const catBuilder = new ProductCategoryUpdateBuilder({
            id: category.id.toString(),
            kind: "UpdateAndAppend",
        })
            //Was used for an update on existing datasets - strictly not necessary anymore - but here for historical purposes.
            .displayName(category.name
            .map(element => ({ value: element.displayName, language: element.language })))
            .data({
            'Image': DataValueFactory.string(category.image),
        });
        categoryUpdates.push(catBuilder.build());
    });
    await integrator.batch(categoryUpdates);
}