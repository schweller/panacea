import Document, { Html, Head, Main, NextScript } from "next/document";
import { getCssText, darkTheme } from '../stitches.config';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="description" content="Panacea is a listing of all open source games published at Ludum Dare" />
          <meta name="keywords" content="Ludum dare, game development, open source"/>
          <meta name="author" content="Inácio Schweller"/>
          <meta property="og:title" content="Panacea - open-source extravaganza" />
          <meta property="og:site_name" content="Panacea" />
          <meta property="og:url" content="https://inacio.dev/panacea"/>
          <meta property="og:description" content="Panacea is a listing of all open source games published at Ludum Dare"/>
          <meta property="og:type" content="website"/>
          <meta property="og:image" content="https://github.com/schweller/panacea/raw/5b2855dacc4ff5939cc873492566a27296d130d4/web/public/panacea-twitter.png"/>          
          <link rel="icon" href="/favicon.ico" />
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssText() }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default MyDocument;