declare module "unzip-stream" {
  function Parse(): NodeJS.WritableStream;
}

declare module "async-es/eachLimit" {
  export default function eachLimit<T>(
    arr: T[],
    limit: number,
    fn: (item: T) => void
  ): Promise<any>;
}
