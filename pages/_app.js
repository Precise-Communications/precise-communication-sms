import React from "react";
import App from 'next/app';

import Head from 'next/head';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/dist/styles.css';
import translations from '@shopify/polaris/locales/en.json';
import { Provider } from '@shopify/app-bridge-react';
import ClientRouter from '../components/ClientRouter';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  fetchOptions: {
    credentials: 'include'
  },
});

class MyApp extends App {
  render() {
    const { Component, pageProps, shopOrigin } = this.props;

    const config = { apiKey: API_KEY, shopOrigin:shopOrigin, forceRedirect: true };
    return (
      <React.Fragment>
        <Head>
          <title>Precise Communications SMS</title>
          <meta charSet="utf-8" />
        </Head>
        <Provider config={config}>
        <ClientRouter />
        <AppProvider i18n={translations}>
        <Component {...pageProps} />
        </AppProvider>
        </Provider>
      </React.Fragment>
    );
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  const { shop } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });
    return {
      shopOrigin: ctx.query.shop,
    }
  }
export default MyApp;