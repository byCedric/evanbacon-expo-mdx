const fs = require('node:fs');
const util = require('node:util');

run();

async function run() {
  const {fromJs} = await import('esast-util-from-js');
  const {visit} = await import('estree-util-visit');

  const ast = fromJs(`const {Bacon, Foobar, ...html} = components;`, { module: true });

  visit(ast, node => {
    delete node.position;
  });

  fs.writeFileSync('./ast.json', JSON.stringify(ast, null, 2));
}
