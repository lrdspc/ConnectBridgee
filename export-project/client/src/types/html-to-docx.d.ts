declare module 'html-to-docx' {
  interface HtmlToDocxOptions {
    /**
     * Lista de opções para personalizar a geração do documento
     */
    title?: string;
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    pageNumbers?: boolean;
    font?: string;
    fontSize?: number;
    tableLayout?: string;
    lineBreaks?: boolean;
    orientation?: 'portrait' | 'landscape';
    header?: string | any[];
    footer?: string | any[];
    [key: string]: any;
  }

  export default function htmlToDocx(
    htmlString: string,
    options?: HtmlToDocxOptions,
    headerHTMLString?: string,
    footerHTMLString?: string
  ): Promise<Buffer>;
}