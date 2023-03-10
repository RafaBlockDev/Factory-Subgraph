export class CustomURL {
    protocol: string;
    pathname: string;
    url: string;
  
    constructor(protocol: string, pathname: string, url: string) {
      this.protocol = protocol;
      this.pathname = pathname;
      this.url = url;
    }
  }
  
  export const parseUrl = (url: string): CustomURL | null => {
    if (url.startsWith("ipfs://")) {
      return new CustomURL("ipfs:", url.replace("ipfs:", ""), url);
    }
    return null;
  };
  