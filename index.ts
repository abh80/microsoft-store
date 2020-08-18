import msStore from './msStore'
export interface Searchoptions {
  query: string;
  limit: number;
  platform: string;
}
export interface getOptions {
  url: string;
  system_requirements?: boolean;
}
export {msStore}
export default {msStore}
