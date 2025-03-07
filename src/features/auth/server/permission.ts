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
  subscription: ["create", "update", "delete"],
  documents: ["read", "create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const member = ac.newRole({
  subscription: [],
  documents: ["read", "create", "update", "delete"],
  ...memberAc.statements,
});

export const admin = ac.newRole({
  subscription: ["create", "update"],
  documents: ["read", "create", "update", "delete"],
  ...adminAc.statements,
});

export const owner = ac.newRole({
  subscription: ["create", "update", "delete"],
  documents: ["read", "create", "update", "delete"],
  ...ownerAc.statements,
});
