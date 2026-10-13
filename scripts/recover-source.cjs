// One-time, reproducible recovery of the current published application.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const repo = 'repos/jeanzz2026/wangamiao-2027-race-calendar';
const api = (endpoint) => {
  for (let attempt = 0; attempt < 3; attempt++) {
    try { return JSON.parse(cp.execFileSync('gh', ['api', endpoint], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, timeout: 60000 })); }
    catch { if (attempt === 2) throw new Error(`GitHub read failed: ${endpoint}`); }
  }
};
const head = api(`${repo}/git/ref/heads/main`).object.sha;
const tree = api(`${repo}/git/trees/${head}?recursive=1`).tree;
const snapshot = path.resolve('.recovery/published');
fs.mkdirSync(snapshot, { recursive: true });
// Online user data can be large; it is unrelated to recovering application code.
const wanted = tree.filter(item => item.type === 'blob' && item.path !== 'state.json' && (item.path.startsWith('assets/') || /^[^/]+\.(html|json|svg|png|md)$/.test(item.path)));
for (const item of wanted) {
  const target = path.join(snapshot, item.path);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const blob = api(`${repo}/git/blobs/${item.sha}`);
  fs.writeFileSync(target, Buffer.from(blob.content.replace(/\s/g, ''), 'base64'));
}
const html = fs.readFileSync(path.join(snapshot, 'index.html'), 'utf8');
const bundle = html.match(/src="\.\/assets\/(index-[^"]+\.js)/)[1];
const style = html.match(/href="\.\/assets\/(index-[^"]+\.css)/)[1];
const code = fs.readFileSync(path.join(snapshot, 'assets', bundle), 'utf8');
const ast = parser.parse(code, { sourceType: 'module' });
const boundary = ast.program.body.findIndex(node => t.isVariableDeclaration(node) && node.declarations.some(d => d.id.name === 'Ky'));
if (boundary < 0) throw new Error('Unexpected bundle; recovery boundary not found');
ast.program.body = ast.program.body.slice(boundary);
ast.program.body[0].declarations = ast.program.body[0].declarations.filter(d => d.id.name !== 'Ky');
ast.program.body.unshift(...parser.parse("import React from 'react'; import { createRoot } from 'react-dom/client'; import * as jsxRuntime from 'react/jsx-runtime';", {sourceType:'module'}).program.body);
traverse(ast, { Program(p) {
  for (const [oldName, newName] of Object.entries({ gv:'App', zc:'defaultRaces', xc:'monthNames', nn:'defaultPlacements', jc:'defaultTrainingLibrary', pc:'loadCloudState', tv:'validateGitHubToken', Um:'saveCloudState', Sc:'saveLocalState', lv:'loadLocalState', Fy:'encodeUtf8Base64', Iy:'decodeUtf8Base64' })) {
    if (p.scope.hasOwnBinding(oldName)) p.scope.rename(oldName, newName);
  }
}, ReferencedIdentifier(p) {
  if (!p.scope.hasBinding(p.node.name)) {
    const names = { R:'React', Ly:'React', i:'jsxRuntime', Ky:'reactRoot' };
    if (names[p.node.name]) p.node.name = names[p.node.name];
  }
}, CallExpression: { exit(p) {
  const node=p.node;
  if(t.isMemberExpression(node.callee) && t.isIdentifier(node.callee.object,{name:'reactRoot'}) && t.isIdentifier(node.callee.property,{name:'createRoot'})) { node.callee=t.identifier('createRoot'); return; }
  if(!t.isMemberExpression(node.callee)||!t.isIdentifier(node.callee.object,{name:'jsxRuntime'})||!['jsx','jsxs'].includes(node.callee.property.name)) return;
  const [tag,props,key]=node.arguments;
  if(!t.isObjectExpression(props)) return;
  let name;
  if(t.isStringLiteral(tag)) name=t.jsxIdentifier(tag.value);
  else if(t.isIdentifier(tag)) name=t.jsxIdentifier(tag.name);
  else if(t.isMemberExpression(tag)&&t.isIdentifier(tag.object)&&t.isIdentifier(tag.property)) name=t.jsxMemberExpression(t.jsxIdentifier(tag.object.name),t.jsxIdentifier(tag.property.name));
  else return;
  const attrs=[], children=[];
  for(const prop of props.properties) {
    if(t.isSpreadElement(prop)) { attrs.push(t.jsxSpreadAttribute(prop.argument)); continue; }
    if(!t.isObjectProperty(prop)||prop.computed) return;
    const n=prop.key.name||prop.key.value;
    if(n==='children') children.push(t.jsxExpressionContainer(prop.value));
    else attrs.push(t.jsxAttribute(t.jsxIdentifier(n),t.jsxExpressionContainer(prop.value)));
  }
  if(key) attrs.push(t.jsxAttribute(t.jsxIdentifier('key'),t.jsxExpressionContainer(key)));
  p.replaceWith(t.jsxElement(t.jsxOpeningElement(name,attrs,!children.length),children.length?t.jsxClosingElement(name):null,children));
} }});
for(const dir of ['src','src/styles','public','docs']) fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync('src/App.jsx', '// Recovered from the published bundle. See docs/SOURCE_RECOVERY.md.\n'+generate(ast,{comments:true}).code+'\n');
const css=fs.readFileSync(path.join(snapshot,'assets',style),'utf8').replaceAll('../dog-float.png','../../public/dog-float.png');
fs.writeFileSync('src/styles/app.css', css);
for(const [oldFile,newFile] of [['race-editor.js','src/race-editor.js'],['embed-analysis.js','src/analysis-embed.js'],['embed-analysis.css','src/styles/overrides.css']]) fs.copyFileSync(path.join(snapshot,'assets',oldFile),newFile);
for(const item of wanted.filter(i=>!i.path.includes('/')&&!/\.(html|md)$/.test(i.path)&&i.path!=='package.json')) fs.copyFileSync(path.join(snapshot,item.path),path.join('public',item.path));
fs.writeFileSync('.recovery/base.json',JSON.stringify({commit:head,bundle,style},null,2));
console.log(JSON.stringify({commit:head,bundle,style,applicationBytes:fs.statSync('src/App.jsx').size}));
