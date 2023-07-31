// 環境変数の型定義
// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_OPENAI_API_KEY: string,
    readonly REACT_APP_OPENAI_API_REQUEST_URL: string,
    readonly REACT_APP_WP_APP_PASSWORD: string,
    readonly REACT_APP_WP_API_AUTHORIZATION: string,
    readonly REACT_APP_WP_REST_API_REQUEST_URL: string
  }
}