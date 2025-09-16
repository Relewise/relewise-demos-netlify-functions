import { sanityClient } from "./sanityClient.mts";

export async function generateBrowserLink(relewise_dataset: string, relewise_api: string) {
    const demoConfiguration = await sanityClient.fetch("*[_type == 'relewiseDemoConfig_Core' && id == 'browserconfig'] {  'json': jsonData['code']}");

    const browserconfig = JSON.parse(demoConfiguration[0].json);

    browserconfig.displayName = "Relewise demoshop";
    browserconfig.apiKey = relewise_api;
    browserconfig.datasetId = relewise_dataset;
    return ('https://relewise-demo-shop.netlify.app/?share=' + encodeURIComponent(btoa(JSON.stringify(browserconfig))));
}