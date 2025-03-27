import { Provider } from 'react-redux';
import { store } from '../redux/store';
import Navbar from '../components/Navbar';
import './app.css'; 
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Component {...pageProps} />
        </main>
      </div>
    </Provider>
  );
}

export default MyApp;