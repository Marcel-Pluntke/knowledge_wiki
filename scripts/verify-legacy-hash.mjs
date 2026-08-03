import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';

const expected = {
  'static/mathe-magier/spiel/app.js':'E84881B242BCC4C49F396A4A6B7DDB474D876E96303E378FD9FE6CD4DAFF741D',
  'static/mathe-magier/spiel/style.css':'36BE7EAFD8EA8214221404E5ACDCE85981798149987978545A04732A9D8620B7',
  'static/mathe-magier/spiel/index.html':'43D308BABF893A32FE722195830F90619C5946A1BF56CF1F60F93940B6253334',
};

for (const [file, hash] of Object.entries(expected)) {
  const actual = createHash('sha256').update(await readFile(file)).digest('hex').toUpperCase();
  if (actual !== hash) throw new Error(`Legacy-Referenz wurde verändert: ${file}`);
}
console.log('Legacy-Brüche-Referenz unverändert.');
