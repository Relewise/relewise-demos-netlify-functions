export interface ProductData {
    unique_id: string; // Unique identifier for the product
    brand: {
      id: string;
      displayName: string;
    };
    name: Array<{
      language: string;
      name: string;
    }>;
    description: Array<{
      language: string;
      text: string;
    }>;
    list_price: Array<{
      currency: string;
      amount: number;
    }>;
    sales_price: Array<{
      currency: string;
      amount: number;
    }>;
    availability: Array<{
      language: string;
      number: number;
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
    image: string;
    markets: string[]; // List of region codes
    channels: string[]; // List of sales channels
    margin: string; // Profitability levels (e.g., Negative, High)
    daysAvailable: number;
    salesStatus?: string | null; // Optional sales status
    OnSale: Array<{
      language: string;
      value: boolean;
    }>;
    lowStock: Array<{
      language: string;
      value: boolean;
    }>;
    promoted: Array<{
      language: string;
      value: boolean;
    }>;
    campaignIds: string[];
    soldOut: Array<{
      language: string;
      value: boolean;
    }>;
  }
  