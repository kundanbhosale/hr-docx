export const convertStringToId = (t: string) =>
  t.toLocaleLowerCase().replace(/[^A-Z0-9]+/gi, "_");
