DROP SCHEMA auth;
DROP SCHEMA orgs;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS orgs;
create table "auth"."users" ("id" text not null primary key, "name" text not null, "email" text not null unique, "emailVerified" boolean not null, "image" text, "createdAt" timestamp not null, "updatedAt" timestamp not null);

create table "auth"."sessions" ("id" text not null primary key, "expiresAt" timestamp not null, "token" text not null unique, "createdAt" timestamp not null, "updatedAt" timestamp not null, "ipAddress" text, "userAgent" text, "userId" text not null references "auth"."users" ("id"), "activeOrganizationId" text);

create table "auth"."accounts" ("id" text not null primary key, "accountId" text not null, "providerId" text not null, "userId" text not null references "auth"."users" ("id"), "accessToken" text, "refreshToken" text, "idToken" text, "accessTokenExpiresAt" timestamp, "refreshTokenExpiresAt" timestamp, "scope" text, "password" text, "createdAt" timestamp not null, "updatedAt" timestamp not null);

create table "auth"."verifications" ("id" text not null primary key, "identifier" text not null, "value" text not null, "expiresAt" timestamp not null, "createdAt" timestamp, "updatedAt" timestamp);

create table "orgs"."list" ("id" text not null primary key, "name" text not null, "slug" text not null unique, "logo" text, "createdAt" timestamp not null, "metadata" text);

create table "orgs"."member" ("id" text not null primary key, "organizationId" text not null references "orgs"."list" ("id"), "userId" text not null references "auth"."users" ("id"), "role" text not null, "createdAt" timestamp not null);

create table "orgs"."invitation" ("id" text not null primary key, "organizationId" text not null references "orgs"."list" ("id"), "email" text not null, "role" text, "status" text not null, "expiresAt" timestamp not null, "inviterId" text not null references "auth"."users" ("id"))