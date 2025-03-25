import { Provider } from 'react-redux';
import { store } from '../redux/store';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto p-4">
          <Component {...pageProps} />
        </main>
      </div>
    </Provider>
  );
}

export default MyApp;