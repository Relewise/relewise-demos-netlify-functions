import { readFileSync } from "fs";
import { resolve } from 'path';
import { sanityClient } from "./sanityClient.mts";


export async function setupConfig(config: string, relewise_dataset: string, relewise_api: string) {
  try {
    const demoConfiguration = await sanityClient.fetch("*[_type == 'relewiseDemoConfig_Core' && id == $config] {  'json': jsonData['code'], endpoint}", {config});
    const payload= JSON.parse(demoConfiguration[0].json);

    const url = Netlify.env.get('RELEWISE_SERVER_URL') + relewise_dataset + demoConfiguration[0].endpoint;

await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${relewise_api}`
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => {
        console.error('Error:', error);
      });
  }
  catch (error) {
    console.error('Error reading JSON file:', error);
    return {
      statusCode: 500,
      body: 'Error reading JSON file.',
    };
  }
}
