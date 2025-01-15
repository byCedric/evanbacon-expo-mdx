import {useMDXComponents} from "@bacons/mdx";
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
import {Manual} from "./Manual";
function _createMdxContent(props) {
  const components = {
    ...useMDXComponents(),
    ...props.components
  };
  const {Bacon, Foobar, ...html} = components;
  if (!Bacon) _missingMdxReference("Bacon", true);
  if (!Foobar) _missingMdxReference("Foobar", true);
  if (!html) _missingMdxReference("html", false);
  if (!html.h2) _missingMdxReference("html.h2", true);
  if (!html.p) _missingMdxReference("html.p", true);
  return _jsxs(_Fragment, {
    children: [_jsx(html.h2, {
      children: "Custom Components",
      components: html
    }), "\n", "\n", _jsx(html.p, {
      children: "This is provided by the MDXComponents provider and is now available globally.",
      components: html
    }), "\n", _jsx(Bacon, {
      children: "Global",
      components: html
    }), "\n", _jsx(html.p, {
      children: "This is manually imported.",
      components: html
    }), "\n", _jsx(Manual, {
      children: "Manual",
      components: html
    }), "\n", _jsx(html.p, {
      children: "This is shimmed as it's not available.",
      components: html
    }), "\n", _jsx(Foobar, {
      children: "Shim",
      components: html
    })]
  });
}
export default function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? _jsx(MDXLayout, {
    ...props,
    children: _jsx(_createMdxContent, {
      ...props,
      components: html
    }),
    components: html
  }) : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
