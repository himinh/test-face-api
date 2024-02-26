export const removeDiacriticsAndSpaces = (str: string) => {
  let result = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  // Xóa các khoảng trắng và dấu gạch ngang
  result = result.replace(/\s+/g, '');
  return result;
};
