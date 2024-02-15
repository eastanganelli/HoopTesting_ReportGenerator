import React from 'react';
import './styles.module.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </React.Fragment>
  )
}

export default MyApp
