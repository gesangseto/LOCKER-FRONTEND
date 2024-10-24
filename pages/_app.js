import React from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import { ToastProvider } from '../src/component/ToastProvider';

export default function MyApp({ Component, pageProps }) {
    return (
        <ToastProvider>
            {Component.getLayout ? (
                <LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}</LayoutProvider>
            ) : (
                <LayoutProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </LayoutProvider>
            )}
        </ToastProvider>
    );
}
