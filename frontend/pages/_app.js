import "../styles/globals.css";
import "swiper/css";
import "swiper/css/navigation";
import {SessionProvider} from 'next-auth/react';


function MyApp({ Component, pageProps, session }) {
  return (
  <SessionProvider session={session}>
    <Component {...pageProps} />
  </SessionProvider>
  );
}

export default MyApp;
