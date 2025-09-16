import { LineItem, Currency } from "@relewise/client";

export interface GenerateUserOrdersParams {
    items: LineItem[];
    userCurrency: Currency;
    userClassifications?: any;
    userCompany?: any;
  }