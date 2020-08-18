export const searchurl: string =
  "https://www.microsoft.com/en-us/store/search/games?q=";
export type platform = "xbox" | "pc";
export interface searchObj {
  name: string;
  withGamepass: boolean;
  url: string;
  price?: string;
}
