export interface RelewiseHeaders {
    relewise_api: string;
    relewise_dataset: string;
    relewise_demo_api: string;
  }
  
  export const getRelewiseHeaders = (req: Request): RelewiseHeaders => {
    const relewise_api = req.headers.get("X-Relewise-API")??"";
    const relewise_demo_api = req.headers.get("X-Relewise-API-Demo")??"";
    const relewise_dataset = req.headers.get("X-Relewise-Dataset")??"";
  
    return {
      relewise_api,
      relewise_dataset,
      relewise_demo_api
    };
  };