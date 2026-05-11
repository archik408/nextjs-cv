declare module 'spark-md5' {
  type SparkMD5ArrayBuffer = {
    hash(data: ArrayBuffer, raw?: boolean): string;
  };

  export type SparkMD5Default = {
    ArrayBuffer: SparkMD5ArrayBuffer;
  };

  const SparkMD5: SparkMD5Default;
  export default SparkMD5;
}
