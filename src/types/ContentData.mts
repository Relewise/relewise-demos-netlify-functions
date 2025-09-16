export interface ContentData {
    unique_id: string; // Unique identifier for the product
    headline: Array<{
      language: string;
      text: string;
    }>;
    body: Array<{
      language: string;
      text: string;
    }>;
    summary: Array<{
      language: string;
      text: string;
    }>;
    byline: Array<{
      language: string;
      text: string;
    }>;
    mainCategory: {
      id: string;
      name: Array<{
        language: string;
        displayName: string;
      }>;
      subCategory: {
        id: string;
        name: Array<{
          language: string;
          displayName: string;
        }>;
    }};
    relevant_products: Array<{
      productId: string;
    }>;
    image: string;
    brand: string;
  }
  