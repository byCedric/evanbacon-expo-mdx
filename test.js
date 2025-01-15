const fs = require('node:fs');

const { createSingletonCompiler } = require('./packages/mdx/build/server/metro-transformer');

const { createPlugin } = require('./packages/mdx/build/server/plugins/recma-expo-runtime');
const { rehypeExpoLocalImages } = require('./packages/mdx/build/server/plugins/rehype-expo-local-images');
const { rehypePrefixTagNames } = require('./packages/mdx/build/server/plugins/rehype-prefix-tag-names');

const file = testFile('./apps/demo/src/custom-components.mdx');

run();

async function run() {
  const matchLocalAsset = undefined;
  const recmaExpoRuntime = await createPlugin();

  const compiler = await createSingletonCompiler({
    rehypePlugins: [
      [rehypeExpoLocalImages, { matchLocalAsset }],
      [rehypePrefixTagNames, { prefix: 'html.' }],
    ],
    recmaPlugins: [
      recmaExpoRuntime,
      () => (tree) => {
        fs.writeFileSync('./recma.json', JSON.stringify(tree, null, 2));
      }
    ],
  });

  const result = await compiler.process(file);
  fs.writeFileSync('./recma.js', result.value);
  console.log(result);
}

function testFile(filePath) {
  return {
    path: filePath,
    value: fs.readFileSync(filePath, 'utf-8'),
  };
}
