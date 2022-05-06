import Document, { Html, Head, Main, NextScript } from 'next/document';
import { getInitColorSchemeScript } from '@mui/material/styles';

export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head><meta name="Hello" content="Hello _document" /></Head>
                <body>
                    {/* {getInitColorSchemeScript()} //To use <CssVarsProvider> on SSR, enable this line  */}
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

