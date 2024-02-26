export const convertSortStringToObject = (
  sortString: string,
): Record<string, number> => {
  const sortFields = sortString.split(',');
  const sortObject: Record<string, number> = {};

  sortFields.forEach((field) => {
    const sortOrder = field.startsWith('-') ? -1 : 1;
    const fieldName = field.replace(/^-/, ''); // Remove the leading hyphen if present
    sortObject[fieldName] = sortOrder;
  });

  return sortObject;
};
