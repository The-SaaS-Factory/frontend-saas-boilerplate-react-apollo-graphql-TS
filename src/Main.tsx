import React, { Suspense } from "react";
import {
  ApolloClient,
  createHttpLink,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import App from "./App";
import { createRoot } from "react-dom/client";
import "./index.css";
import { split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { serverURL, serverURLWS } from "./utils/serverUrl";
import "./utils/i18n.js";
import Loading from "./components/commons/Loading";
const token = localStorage.getItem("token");

const httpLink = createHttpLink({
  uri: serverURL + "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    },
  };
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: serverURLWS + "/graphql/ws",
    connectionParams: {
      authToken: token,
    },
  })
);
 
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

const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
});

const rootElement: HTMLElement  = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    </ApolloProvider>
  </React.StrictMode>
);
