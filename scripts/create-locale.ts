import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ensureDirectoryExists = (filePath: string) => {
  const directory = path.dirname(filePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const createLocaleFile = (moduleName: string) => {
  const localePath = path.resolve(
    process.cwd(),
    `src/modules/shared/hooks/use-i18n/locales/vi/modules/${moduleName}.locale.ts`,
  );

  ensureDirectoryExists(localePath);

  const localeTemplate = `export const ${moduleName}Locale = {
  // #region TITLE + META
  ${moduleName}_index_title: '',
  ${moduleName}_create_title: '',
  ${moduleName}_edit_title: '',
  // #endregion TITLE + META

  // #region FORM + TABLE
  ${moduleName}_name: '',
  ${moduleName}_description: '',
  ${moduleName}_created_at: '',
  ${moduleName}_updated_at: '',
  // #endregion FORM + TABLE

  // #region BUTTON
  // #endregion BUTTON

  // #region COMMON
  // #endregion COMMON
} as const;
`;

  if (fs.existsSync(localePath)) {
    console.error(`Locale file for ${moduleName} already exists!`);
    return false;
  }

  fs.writeFileSync(localePath, localeTemplate);
  console.log(`Created locale file for ${moduleName}`);

  return true;
};

const updateViLocale = (moduleName: string) => {
  const viLocalePath = path.resolve(
    process.cwd(),
    'src/modules/shared/hooks/use-i18n/locales/vi.locale.ts',
  );

  let viLocaleContent = fs.readFileSync(viLocalePath, 'utf8');

  const importStatement = `import { ${moduleName}Locale } from '@shared/hooks/use-i18n/locales/vi/modules/${moduleName}.locale';`;

  if (!viLocaleContent.includes(importStatement)) {
    const lastImportIndex = viLocaleContent.lastIndexOf('import ');
    const insertIndex = viLocaleContent.indexOf('\n', lastImportIndex) + 1;

    viLocaleContent = `${
      viLocaleContent.slice(0, insertIndex) + importStatement
    }\n${viLocaleContent.slice(insertIndex)}`;
  }

  const typeUpdateRegex = /(export type LocaleKeys =\n.*\n)(.*\|)/;
  viLocaleContent = viLocaleContent.replace(
    typeUpdateRegex,
    `$1$2\n keyof typeof ${moduleName}Locale | \n`,
  );

  const localeObjectRegex =
    /(export const viLocale = {[\s\S]*?)(\n} as const;)/;
  viLocaleContent = viLocaleContent.replace(
    localeObjectRegex,
    `$1  ...${moduleName}Locale,$2`,
  );

  fs.writeFileSync(viLocalePath, viLocaleContent);
  console.log(`Updated vi.locale.ts with ${moduleName} locale`);
};

const formatWithBiome = (moduleName: string) => {
  try {
    const filesToFormat = [
      `src/modules/shared/hooks/use-i18n/locales/vi/modules/${moduleName}.locale.ts`,
      'src/modules/shared/hooks/use-i18n/locales/vi.locale.ts',
    ];

    for (const file of filesToFormat) {
      const fullPath = path.resolve(process.cwd(), file);
      execSync(`bun biome format --write "${fullPath}"`, { stdio: 'inherit' });
      console.log(`Formatted ${file}`);
    }
  } catch (error) {
    console.error('Error formatting files with Biome:', error);
  }
};

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('Please provide a module name');
  process.exit(1);
}

if (createLocaleFile(moduleName)) {
  updateViLocale(moduleName);
  formatWithBiome(moduleName);
}
