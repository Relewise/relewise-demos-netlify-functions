import { Integrator } from "@relewise/integrations";
import {Order, Trackable, UserFactory} from "@relewise/client";
import { randomUUID } from 'crypto';
import { GenerateUserOrdersParams } from "../../src/types/GenerateUserOrdersParams.mts";

export async function AddUserOrders(relewise_dataset: string, relewise_api: string)
{
    console.log("Starting order generation for dataset");
//    console.log("This is the apiKey in use: ", relewise_api, " - relewise_dataset: ", relewise_dataset);

    await generateUserOrders({
        items:[
            { product: { "id": "ac6f8cb5-7338-49ec-97ba-60d62dbf20f6" }, quantity: 1, lineTotal: 2999.99 }, //Samsung QLED 8K
            { product: { "id": "65d4a00e-606c-45c4-908f-a4bada7c6f47" }, quantity: 1, lineTotal: 899.99 }, //Samsung HW-Q70T 
            { product: { "id": "307fc510-e22e-469b-a33f-eb57a3f29614" }, quantity: 1, lineTotal: 49.99 }, //Philips Hue White Ambiance Lamp
        ], 
        userCurrency: { value: 'DKK' },
        userClassifications: { "country": "dk", "channel": "B2C" }
        }, relewise_dataset, relewise_api);
    
        await generateUserOrders({
        items: [
            { product: { "id": "ac6f8cb5-7338-49ec-97ba-60d62dbf20f6" }, quantity: 1, lineTotal: 2999.99 }, //Samsung QLED 8K
            { product: { "id": "65d4a00e-606c-45c4-908f-a4bada7c6f47" }, quantity: 1, lineTotal: 899.99 }, //Samsung HW-Q70T 
            { product: { "id": "399aa119-af3e-4e16-9ecd-b88def7ebf8f" }, quantity: 1, lineTotal: 59.99 }, //Philips Hue White and Color Ambiance
        ], 
            userCurrency: { value: 'SEK' },
            userClassifications: { "country": "se", "channel": "B2C" }
        }, relewise_dataset, relewise_api);

    await generateUserOrders({
        items: [
            { product: { "id": "072489c7-9f66-4d14-89d0-408830099c9c" }, quantity: 1, lineTotal: 6843.00 }, //Philips 27M1F5800/00 Gaming-skjerm
        ], 
            userCurrency: { value: 'NOK' },
            userClassifications: { "country": "no", "channel": "B2C" }, 
        }, relewise_dataset, relewise_api);

    await generateUserOrders({
        items: [
            { product: { "id": "f8b1274d-f43a-41ed-be01-b2d64be1f848" }, quantity: 1, lineTotal: 579 }, //Apple iPad Air
            { product: { "id": "cad0b330-c1f3-49ea-ac6f-391c8cf13562" }, quantity: 1, lineTotal: 899.99 }, //Apple AirPods Max
            { product: { "id": "2725e70e-c134-4ac9-9779-e3849d871877" }, quantity: 1, lineTotal: 179.95 }, //JBL Charge 4
            { product: { "id": "89f02b41-694d-4b3f-8c63-0076070fa6ee" }, quantity: 1, lineTotal: 25.99 }, //Apple Lightning to USB-C Cable
        ], 
            userCurrency: { value: 'GBP' },
            userClassifications: { "country": "gb", "channel": "B2C" }, 
        }, relewise_dataset, relewise_api);

    await generateUserOrders({
        items: [
            { product: { "id": "1f0e56a5-5cb9-4f92-bb01-440e1e093654" }, quantity: 1, lineTotal: 699.00 }, //Whirlpool WFO3T123XPL
            { product: { "id": "5c69d9b6-0f3a-487e-a4e4-2de4a21a7dcd" }, quantity: 1, lineTotal: 8.99 }, //Mykner Salt
            { product: { "id": "bac2a64e-de29-45c8-a73a-bf06033b585f" }, quantity: 1, lineTotal: 789.99 }, //Samsung Series 4 RB36R8830S9
          ], 
            userCurrency: { value: 'EUR' },
            userClassifications: { "channel": "B2B" }, 
            userCompany: { "id": "b2bcompany1" }
        }, relewise_dataset, relewise_api);

    await generateUserOrders({
        items: [
            { product: { "id": "73b3b05f-6f91-4c4a-8e0b-bca6a76f6e6d"}, quantity: 1, lineTotal: 15.99 }, //Bosch Oppvaskmaskin Tabletter
            { product: { "id": "3d0b7fd1-e38b-4ca9-9c75-799793bb4c6f"}, quantity: 1, lineTotal: 679.00 }, //Siemens SN236I01KE
            { product: { "id": "d361e412-c61e-4293-a830-4905749baf18"}, quantity: 1, lineTotal: 749.00 }, //Bosch Serie 4 KGE36VI4A
          ], 
            userCurrency: { value: 'EUR' },
            userClassifications: { "channel": "B2B" }, 
            userCompany: { "id": "b2bcompany2" }
        }, relewise_dataset, relewise_api);

        //console.log("Done generating orders for Dataset: " + datasetName);
}

async function generateUserOrders({items, userCurrency, userClassifications, userCompany} : GenerateUserOrdersParams, relewise_dataset: string, relewise_api: string)
{
    const integrator = new Integrator(
      relewise_dataset,
      relewise_api,
      {
        serverUrl: Netlify.env.get('RELEWISE_SERVER_URL'),
      }
    );

  const orders: Trackable[] = [];

  for (let index = 0; index < 500; index++) {
    const user = UserFactory.byAuthenticatedId(randomUUID());
    user.classifications = userClassifications ?? null;
    user.company = userCompany ?? null; 

    const order: Order = {
      $type: "Relewise.Client.DataTypes.Order, Relewise.Client",
      orderNumber: randomUUID() as string,
      lineItems: items,
      cartName: 'default',
      user: user,
      subtotal: {
        amount: items.reduce((total, item) => total + item.quantity * item.lineTotal, 0),
        currency: userCurrency
      }
    }

    orders.push(order)
  }
  try {
    await integrator.batch(orders);
    console.log("generateUserOrders - ", JSON.stringify(userClassifications, null, 2) + JSON.stringify(userCompany, null, 2) + " - done");

  } catch (error) {
    console.log(error);
  }
}