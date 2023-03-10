import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import '../styles/demo/Demos.scss';
import '../styles/layout/layout.scss';

export default function MyApp({ Component, pageProps }) {
  if (Component.getLayout) {
    return (
      <LayoutProvider>
        {Component.getLayout(<Component {...pageProps} />)}
      </LayoutProvider>
    );
  } else {
    return (
      <LayoutProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LayoutProvider>
    );
  }
}
