import fs from 'node:fs';
fs.mkdirSync('public', { recursive: true });
for (const name of ['state.json', 'itra_data.json', 'race-details.json']) {
  if (fs.existsSync(name)) fs.copyFileSync(name, `public/${name}`);
}
