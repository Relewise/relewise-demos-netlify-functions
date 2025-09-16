import { Trackable, UserFactory, LineItem, Money, Order } from "@relewise/client";
import { Integrator } from "@relewise/integrations";
import { sanityClient } from "./sanityClient.mts";
import { randomUUID } from 'crypto';

export async function pushBaseOrdersToDemo(relewise_dataset: string, relewise_api: string) {
    const seedProducts = await sanityClient.fetch("*[_type == 'relewiseProduct' && productType=='base'] {unique_id, 'name': name[0].value, NoOrders, 'sales_price':sales_price[0].value, complementaryBoughtTogether[] -> {unique_id, productType, 'name': name[0].value, 'sales_price':sales_price[0].value}, accessoriesboughtTogether[] -> {unique_id, productType, 'name': name[0].value, 'sales_price':sales_price[0].value}}");
    const productReplacements = await sanityClient.fetch("*[_type == 'relewiseProduct' && productType=='replacement'] {unique_id, 'name': name[0].value, NoOrders, 'sales_price':sales_price[0].value, complementaryBoughtTogether[] -> {unique_id, productType, 'name': name[0].value, 'sales_price':sales_price[0].value}, accessoriesboughtTogether[] -> {unique_id, productType, 'name': name[0].value, 'sales_price':sales_price[0].value}}");
    const complementaryProducts = await sanityClient.fetch("*[_type == 'relewiseProduct' && productType=='complementary']{unique_id, 'sales_price':sales_price[0].value}");
  
    const productFiles = [seedProducts, productReplacements];
  
  const integrator = new Integrator(
    relewise_dataset,
    relewise_api,
    {
      serverUrl: Netlify.env.get('RELEWISE_SERVER_URL'),
    });
  
    for (let index = 0; index < productFiles.length; index++) {
      for (const product of productFiles[index]) {
  
        const orders: Trackable[] = [];
  
        if (product.NoOrders == true) //Some products should NOT be in ANY orders.
          continue;
  
        console.log("Generating orders for Product: " + product.name);
  
        const compProducts = product.complementaryBoughtTogether;
        const accessories = product.accessoriesboughtTogether;
  
        let noOfCompProducts = compProducts.length;
  
        try {
          await create5TopProductsOrder(product, compProducts.slice(0, 5), accessories.slice(0, 3), relewise_dataset, relewise_api);
        }
        catch (error) {
          console.log(error);
        }
  
        for (let index = 0; index < compProducts.length; index++) {
          const compProduct = complementaryProducts.find(product => product.unique_id === compProducts[index].unique_id);
  
          if (compProduct) {
            for (let index = noOfCompProducts; index > 0; index--) {
              const accessory = accessories[index] ? accessories[index] : accessories[accessories.length - 1];
              const user = UserFactory.byTemporaryId(randomUUID());
              if (!accessory) {
                console.log("accessory null")
              }
              const items: LineItem[] = [
                { product: { "id": product.unique_id }, quantity: 1, lineTotal: product.sales_price },
                { product: { "id": compProduct.unique_id }, quantity: 1, lineTotal: compProduct?.sales_price },
                { product: { "id": accessory.unique_id }, quantity: 1, lineTotal: accessory?.sales_price },
              ];
  
              const subtotal: Money = {
                amount: items.reduce((total, item) => total + item.quantity * item.lineTotal, 0),
                currency: { value: 'EUR' }
              };
  
              const order: Order = {
                $type: "Relewise.Client.DataTypes.Order, Relewise.Client",
                orderNumber: randomUUID() as string,
                lineItems: items,
                cartName: 'default',
                user: user,
                subtotal: subtotal,
              };
  
              try {
                orders.push(order)
              }
              catch (error) {
                console.log(error);
              }
            }
          }
          noOfCompProducts--;
        }
        try {
          await integrator.batch(orders);
        }
        catch (error) {
          console.log(error);
        }
  
      }
    }
    console.log("generateOrders - done");
  }

  async function create5TopProductsOrder(product, listOfTop5Products, listOfTopAccessories, relewise_dataset, relewise_api) {
    const integrator = new Integrator(
        relewise_dataset,
        relewise_api,
        {
          serverUrl: Netlify.env.get('RELEWISE_SERVER_URL'),
        });

        const user = UserFactory.byTemporaryId(randomUUID());
    
    const lineItems = [
      { product: { "id": product.unique_id }, quantity: 1, lineTotal: product.sales_price },
      { product: { "id": listOfTop5Products[0].unique_id }, quantity: 1, lineTotal: listOfTop5Products[0].sales_price },
      { product: { "id": listOfTop5Products[1].unique_id }, quantity: 1, lineTotal: listOfTop5Products[1].sales_price },
      { product: { "id": listOfTop5Products[2].unique_id }, quantity: 1, lineTotal: listOfTop5Products[2].sales_price },
      { product: { "id": listOfTop5Products[3].unique_id }, quantity: 1, lineTotal: listOfTop5Products[3].sales_price },
      { product: { "id": listOfTop5Products[4].unique_id }, quantity: 1, lineTotal: listOfTop5Products[4].sales_price },
      { product: { "id": listOfTopAccessories[0].unique_id }, quantity: 1, lineTotal: listOfTopAccessories[0].sales_price },
      { product: { "id": listOfTopAccessories[1].unique_id }, quantity: 1, lineTotal: listOfTopAccessories[1].sales_price },
      { product: { "id": listOfTopAccessories[2].unique_id }, quantity: 1, lineTotal: listOfTopAccessories[2].sales_price },
    ];
  
    const subtotal: Money = {
      amount: lineItems.reduce((total, item) => total + item.quantity * item.lineTotal, 0),
      currency: { value: 'EUR' }
    };
  
    const uniqueOrderId = randomUUID();

    const order: Order = {
      $type: "Relewise.Client.DataTypes.Order, Relewise.Client",
      orderNumber: uniqueOrderId as string, // A unique order number
      user: user,
      cartName: 'default',
      lineItems: lineItems,
      subtotal: subtotal,
    };
  
    const orders: Trackable[] = [];
    orders.push(order);
    try {
      await integrator.batch(orders);
    } catch (error) {
      console.log(error);
    }
  
    console.log("create5TopProductsOrder for product: " + product.name + " - done");
  
  }