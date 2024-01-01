import React, { PropsWithChildren, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  from,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import App from "./App";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const serverURL = import.meta.env.VITE_APOLLO_SERVER_URL;
const serverWSURL = import.meta.env.VITE_APOLLO_SERVER_WS_URL;


const httpLink = createHttpLink({
  uri: serverURL,
});

export const ApolloProviderWrapper = ({ children }: PropsWithChildren) => {
  const { getToken } = useAuth(); //Clerk Hook

  const wsLink = new GraphQLWsLink(
    createClient({
      url: serverWSURL,
    })
  );

  const client = useMemo(() => {
    const authMiddleware = setContext(async (_operation, { headers }) => {
      const token = await getToken();

      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`,
        },
      };
    });

    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    );

    return new ApolloClient({
      link: from([authMiddleware, splitLink]),
      cache: new InMemoryCache(),
      
    });
  }, [getToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ApolloProviderWrapper>
        <App />
      </ApolloProviderWrapper>
    </ClerkProvider>
  </React.StrictMode>
);
