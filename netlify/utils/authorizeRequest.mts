import { getRelewiseHeaders } from "./getRelewiseHeaders.mts";

/**
 * Checks the API key from request headers against the environment variable.
 * @param req - The Netlify function event object
 * @returns Boolean - True if authorized, false otherwise
 */
export const authorizeRequest = (req: Request): boolean => {
  if (req.method !== "POST") {
    return false;
  }
  
  const requestKey = req.headers.get('X-API-Key');
  const apiKey = Netlify.env.get("AUTHORIZATION_KEY");

    const { relewise_api, relewise_dataset } = getRelewiseHeaders(req);
  

  if (requestKey && requestKey === apiKey) {
    if (relewise_api || relewise_dataset) {
      return true;      
    }
  }

  return false;
};