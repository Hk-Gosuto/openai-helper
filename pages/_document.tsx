import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>"></link>
          <meta
            name="description"
            content="Simplify your chat content in seconds."
          />
          <meta property="og:site_name" content="Chat Simplifier" />
          <meta
            property="og:description"
            content="Simplify your chat content in seconds."
          />
          <meta property="og:title" content="Chat Simplifier" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Chat Simplifier" />
          <meta
            name="twitter:description"
            content="Simplify your chat content in seconds."
          />
          <meta
            property="og:image"
            content="https://chat-simplifier.vercel.app/og-image.png"
          />
          <meta
            name="twitter:image"
            content="https://chat-simplifier.vercel.app/og-image.png"
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
