import { gql } from "@apollo/client";

const GET_ALL_INVOICES = gql`
  query GetAllInvoices {
    getAllInvoices {
      amount
      createdAt
      gatewayId
      gateway
      id
      invoicePdfUrl
      invoiceUrl
      status
      user {
        id
        name
      }
      updatedAt
      currencyId
      organization {
        id
        name
      }
    }
  }
`;

export { GET_ALL_INVOICES };
