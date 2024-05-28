import fs from 'fs-extra';
import handlebars from 'handlebars'
import path from 'path';

const loadTemplate = async (templateName: string, data: object): Promise<string> => {
  const filePath = path.join(__dirname, '../templates', `${templateName}.html`);
  const source = await fs.readFile(filePath, 'utf-8');
  const template = handlebars.compile(source);
  return template(data);
};

export { loadTemplate };
