import { writeFileSync } from 'fs';
import { join } from 'path';

export const generateNewFile = async (
  folderPath: string,
  fileExtName: string,
) => {
  const randomNamePre = Array(24)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

  const randomNameSux = Array(16)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

  const emptyBuffer = Buffer.alloc(0);

  const filePath = join(
    folderPath,
    `${Date.now()}_${randomNamePre}_${randomNameSux}${fileExtName}`,
  );

  writeFileSync(filePath, emptyBuffer);

  return filePath;
};
