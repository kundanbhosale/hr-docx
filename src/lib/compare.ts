export function compareObjects(
  oldArray: Array<Record<string, any>>,
  newArray: Array<Record<string, any>>
) {
  // Create a Map of old objects with id as key
  const oldMap = new Map(oldArray.map((obj) => [obj.id, obj]));

  return newArray.filter((newObj) => {
    const oldObj = oldMap.get(newObj.id);
    if (!oldObj) return false;

    return JSON.stringify(oldObj) !== JSON.stringify(newObj);
  });
}
