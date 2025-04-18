/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type ArrayType<T> = ArrayTypeImpl<T> extends (infer U)[]
  ? U[]
  : ArrayTypeImpl<T>;

export type ArrayTypeImpl<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S[], I[], U[]>
  : T[];

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [x: string]: JsonValue | undefined;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface AuthAccounts {
  accessToken: string | null;
  accessTokenExpiresAt: Timestamp | null;
  accountId: string;
  createdAt: Timestamp;
  id: string;
  idToken: string | null;
  password: string | null;
  providerId: string;
  refreshToken: string | null;
  refreshTokenExpiresAt: Timestamp | null;
  scope: string | null;
  updatedAt: Timestamp;
  userId: string;
}

export interface AuthSessions {
  activeOrganizationId: string | null;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  id: string;
  ipAddress: string | null;
  token: string;
  updatedAt: Timestamp;
  userAgent: string | null;
  userId: string;
}

export interface AuthUsers {
  createdAt: Timestamp;
  email: string;
  emailVerified: boolean;
  id: string;
  image: string | null;
  name: string;
  updatedAt: Timestamp;
}

export interface AuthVerifications {
  createdAt: Timestamp | null;
  expiresAt: Timestamp;
  id: string;
  identifier: string;
  updatedAt: Timestamp | null;
  value: string;
}

export interface Documents {
  content: string;
  created_at: Generated<Timestamp | null>;
  created_by: string | null;
  deleted_at: Timestamp | null;
  downloads: Generated<number>;
  id: string;
  org: string;
  /**
   * @type:Array<{id: string,desc: string,type: string | any,title: string,value: string}>
   */
  schema: Array<{id: string,desc: string,type: string | any,title: string,value: string}>
  starred: Generated<boolean>;
  template: string | null;
  template_version: Generated<number>;
  thumbnail: string | null;
  title: string | null;
  updated_at: Timestamp | null;
}

export interface Groups {
  color: string | null;
  created_at: Generated<Timestamp | null>;
  created_by: string | null;
  deleted_at: Timestamp | null;
  id: string;
  is_public: Generated<boolean | null>;
  slug: string;
  thumbnail: string | null;
  title: string;
  updated_at: Timestamp | null;
}

export interface OrgsInvitation {
  email: string;
  expiresAt: Timestamp;
  id: string;
  inviterId: string;
  organizationId: string;
  role: string | null;
  status: string;
}

export interface OrgsList {
  createdAt: Timestamp;
  id: string;
  logo: string | null;
  /**
   * @type:{subscription:{id:string,status:string,current_start:number,current_end:number,plan:string, plan_id:string} | null, credits:{download:number}}
   */
  metadata: {subscription:{id:string,status:string,current_start:number,current_end:number,plan:string, plan_id:string} | null, credits:{download:number}}
  name: string;
  slug: string;
}

export interface OrgsMember {
  createdAt: Timestamp;
  id: string;
  organizationId: string;
  role: string;
  userId: string;
}

export interface OrgsOrders {
  created_at: Generated<Timestamp | null>;
  created_by: string;
  deleted_at: Timestamp | null;
  id: string;
  metadata: Json | null;
  org: string;
  ref: string;
  updated_at: Timestamp | null;
}

export interface Templates {
  content: string;
  created_at: Generated<Timestamp | null>;
  created_by: string | null;
  deleted_at: Timestamp | null;
  group: string | null;
  id: string;
  is_public: Generated<boolean | null>;
  /**
   * @type:Array<{id: string,desc: string,type: string | any,title: string,value: string}>
   */
  schema: Array<{id: string,desc: string,type: string | any,title: string,value: string}>
  slug: string;
  template_version: Generated<number>;
  thumbnail: string | null;
  title: string;
  updated_at: Generated<Timestamp | null>;
}

export interface DB {
  "auth.accounts": AuthAccounts;
  "auth.sessions": AuthSessions;
  "auth.users": AuthUsers;
  "auth.verifications": AuthVerifications;
  documents: Documents;
  groups: Groups;
  "orgs.invitation": OrgsInvitation;
  "orgs.list": OrgsList;
  "orgs.member": OrgsMember;
  "orgs.orders": OrgsOrders;
  templates: Templates;
}
