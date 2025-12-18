import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es" style={{ scrollBehavior: 'smooth' }} data-scroll-behavior="smooth">
      <Head>
        <title>Carlend - Renta de Autos</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
