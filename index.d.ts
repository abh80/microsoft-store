import msStore from './msStore';
export interface Searchoptions {
    query: string;
    limit: number;
    platform: string;
}
export interface getOptions {
    url: string;
    system_requirements?: boolean;
}
export { msStore };
declare const _default: {
    msStore: typeof msStore;
};
export default _default;
