import { gql } from "@apollo/client";

export const COMMON_SALE_FIELDS = gql`
  fragment CommonSaleFields on CoretimeSale {
    id
    purchaseCount
    purchaseRevenue
    renewalCount
    renewalRevenue
    totalRevenue
  }
`;

export const SALE_INFO_FIELDS = gql`
  fragment SaleInfoFields on CoretimeSale {
    info {
      coresOffered
      coresSold
      endPrice
      firstCore
      idealCoresSold
      leadinLength
      price
      regionBegin
      regionEnd
      saleStart
      selloutPrice
    }
  }
`;
