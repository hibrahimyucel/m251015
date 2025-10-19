export type role = "admin" | "member" | "public";

export type unitType =
  | "scope"
  | "module"
  | "component"
  | "api"
  | "action"
  | "input"
  | "string"
  | "number"
  | "date"
  | "time"
  | "datetime"
  | "decimal";

export interface dictionary<T> {
  [key: string]: T;
}

export interface projectUnit {
  name: string;
  type: unitType;
  caption?: string | null;
  description?: string | null;
  path?: string | null;
  roles?: Array<role> | null;
  fields?: dictionary<projectUnit> | null;
  actions?: dictionary<projectUnit> | null;
  modules?: dictionary<projectUnit> | null;
  apis?: dictionary<projectUnit> | null;
}

export const publicRoles: role[] = ["admin", "member", "public"];
