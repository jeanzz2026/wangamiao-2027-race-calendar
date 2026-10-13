import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const check = process.argv.includes('--check');
const release = JSON.parse(fs.readFileSync('release.json', 'utf8'));
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (release.version !== pkg.version) throw new Error('package.json 与 release.json 版本不一致');
const files = ['index.html', ...fs.readdirSync('dist/assets').sort().map(name => `assets/${name}`)];
const hashes = {};
for (const name of files) {
  const source = fs.readFileSync(path.join('dist', name));
  hashes[name] = crypto.createHash('sha256').update(source).digest('hex');
  if (check) {
    if (!fs.existsSync(name) || !fs.readFileSync(name).equals(source)) throw new Error(`发布资源与源码不一致: ${name}。请运行 npm run release 并一同提交。`);
  } else {
    fs.mkdirSync(path.dirname(name), { recursive: true });
    fs.writeFileSync(name, source);
  }
}
const manifest = JSON.stringify({ ...release, files: hashes }, null, 2) + '\n';
if (check) {
  if (!fs.existsSync('build-manifest.json') || fs.readFileSync('build-manifest.json', 'utf8') !== manifest) throw new Error('发布清单不一致，请运行 npm run release');
} else fs.writeFileSync('build-manifest.json', manifest);
console.log(`${check ? 'Verified' : 'Released'} v${release.version}: ${files.length} generated files; online state.json and itra_data.json untouched.`);
