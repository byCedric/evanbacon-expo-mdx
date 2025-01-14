const upstreamTransformer = require("@expo/metro-config/babel-transformer");
const MdxTransformer = require("@bacons/mdx/metro-transformer");

module.exports.transform = async (props) => {
  const mdxTransformer = MdxTransformer.createTransformer({
    remarkPlugins: [[(await import('remark-mdx-frontmatter')).default, { name: "meta" }]],
  });

  // Then pass it to the upstream transformer.
  return upstreamTransformer.transform(
    // Transpile MDX first.
    await mdxTransformer.transform(props)
  );
};
