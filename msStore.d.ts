import * as config from "./config";
interface searchReturn {
    name: string;
    withGamepass: boolean;
    url: string;
    price?: string;
}
interface getReturn {
    name: string;
    img: string;
    publisher: string;
    rating: string;
    rating_description: string;
    price: string;
    system_requirements?: {
        minimum: any[];
        recommended: any[];
    };
}
export default class MsStore {
    version: string;
    constructor();
    search(query: string, platform: config.platform, limit?: number): Promise<searchReturn[]>;
    get(url: string, system_requirements?: boolean): Promise<getReturn>;
}
export {};
