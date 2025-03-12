import {
  adminAc,
  createAccessControl,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/access";

/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const statement = {
  ...defaultStatements,
  payments: ["create", "read"],
  subscription: ["read", "create", "update", "delete"],
  documents: ["read", "create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const member = ac.newRole({
  payments: [],

  subscription: ["read"],
  documents: ["read", "create", "update", "delete"],
  ...memberAc.statements,
});

export const admin = ac.newRole({
  payments: [],

  subscription: ["read"],
  documents: ["read", "create", "update", "delete"],
  ...adminAc.statements,
});

export const owner = ac.newRole({
  payments: ["create", "read"],
  subscription: ["read", "create", "update", "delete"],
  documents: ["read", "create", "update", "delete"],
  ...ownerAc.statements,
});
