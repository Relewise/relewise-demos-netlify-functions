import { Trackable, DataValueFactory, ProductVariant } from "@relewise/client";
import { Integrator, ProductUpdateBuilder, ProductVariantBuilder } from "@relewise/integrations";

export async function createVariantsForProduct(relewise_dataset: string, relewise_api: string) {
  const productUpdates: Trackable[] = [];
  const variants: ProductVariant[] = [];
  var colorVariants_DK = ["Rød", "Blå", "Hvid"];
  var colorVariants_EN = ["Red", "Blue", "White"];
  var materialVariants = ["Plastic", "Metal"]
  var productId = "307fc510-e22e-469b-a33f-eb57a3f29614";


  const integrator = new Integrator(
    relewise_dataset,
    relewise_api,
    {
      serverUrl: Netlify.env.get('RELEWISE_SERVER_URL'),
    });

  var prod = new ProductUpdateBuilder({ id: productId, productUpdateKind: 'UpdateAndAppend', });

  colorVariants_DK.forEach((colVar, index) => {
    materialVariants.forEach((matVar, mat_index) => {
      var prod_variant = new ProductVariantBuilder({ id: productId + "_" + index + "_" + mat_index })
        .displayName([{ language: "en-gb", value: "Philips Hue Ambiance table lamp" }, { language: "da-dk", value: "Philips Hue bordlampe" }])
        .data({
          'Color': DataValueFactory.multilingual([{ language: "da-dk", value: colVar }, { language: "en-gb", value: colorVariants_EN[index] }]),
          'Material': DataValueFactory.multilingual([{ language: "da-dk", value: matVar }, { language: "en-gb", value: matVar }]),
          'ImageUrl': DataValueFactory.string("https://res.cloudinary.com/relewisedemodata/image/upload/v1724945909/electronics/307fc510-e22e-469b-a33f-eb57a3f29614_" + index + "_" + mat_index + ".png")
        });

      variants.push(prod_variant.build());
    })
  });

  prod.variants(variants);
  productUpdates.push(prod.build());

  await integrator.batch(productUpdates);
}
