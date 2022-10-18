import Document, { Html, Head, Main, NextScript } from "next/document";
import { getCssText, darkTheme } from '../stitches.config';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="description" content="Panacea is a listing of all open source games published at Ludum Dare" />
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