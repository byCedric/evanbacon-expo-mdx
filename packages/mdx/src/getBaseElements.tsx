import { Image, Text, View } from "@bacons/react-views";
import * as htmlElements from "@expo/html-elements";
import React, { Children } from "react";
import { Platform } from "react-native";

import { AutoImage } from "./AutoImage";
import * as headings from "./headings";
import * as List from "./list/List";

const OrderContext = React.createContext<{
  index: number;
  firstChild: boolean;
  lastChild: boolean;
  firstOfType: boolean;
  prevSibling: string;
} | null>(null);


export function getBaseElements() {
  const passthroughElements = [
    "table",
    "thead",
    "tbody",
    "tfoot",
    "th",
    "tr",
    "td",
    "caption",

    // Task lists
    "sup",
    "ul",
    "li",
    "ol",
    "input",
  ].map((elementName) => [elementName, stripExtras(Platform.OS === 'web' ? elementName : View, elementName)]);

  return {
    // Defaults to ensure web always works since this is a web-first feature.
    // Native can be extended as needed.
    ...Object.fromEntries(passthroughElements),

    ...Platform.select({
    
      native: {
        ul: List.UL,
        // TODO
        li: List.LI,
        // TODO
        ol: List.UL,    
      }
    }),

    Wrapper: ({ children }) => {
      const prevChildTypes = ["root"];
      const childrenCount = Children.count(children);
      return Children.map(children, (child, index) => {
        if (typeof child === "string") {
          return child;
        }
        const prevSibling = prevChildTypes[prevChildTypes.length - 1];
        const mdxType = child.props.mdxType || "element";
        const isFirstOfType =
          prevChildTypes[prevChildTypes.length - 1] !== mdxType;
        prevChildTypes.push(mdxType);

        return (
          <OrderContext.Provider
            value={{
              index,
              firstChild: index === 0,
              lastChild: index === childrenCount - 1,
              firstOfType: isFirstOfType,
              prevSibling,
            }}
          >
            {child}
          </OrderContext.Provider>
        );
        //  React.cloneElement(
        //   child,
        //   {
        //     ...child.props,
        //     index,
        //     firstChild: index === 0,
        //     lastChild: index === childrenCount - 1,
        //     firstOfType: isFirstOfType,
        //     prevSibling,
        //   },
        //   child.props.children
        // );
      });
    },

    h1: wrapHeader(headings.H1),
    h2: wrapHeader(headings.H2),
    h3: wrapHeader(headings.H3),
    h4: wrapHeader(headings.H4),
    h5: stripExtras(headings.H5),
    h6: stripExtras(headings.H6),

    a: stripExtras(htmlElements.A),

  
    nav: stripExtras(htmlElements.Nav),
    footer: stripExtras(htmlElements.Footer),
    aside: stripExtras(htmlElements.Aside),
    header: stripExtras(htmlElements.Header),
    main: stripExtras(htmlElements.Main),
    article: stripExtras(htmlElements.Article),
    section: stripExtras(htmlElements.Section),

    p: Paragraph,
    b: stripExtras(htmlElements.B),
    s: stripExtras(htmlElements.S),
    i: stripExtras(htmlElements.I),
    q: stripExtras(htmlElements.Q),
    blockquote: stripExtras(htmlElements.BlockQuote),
    br: stripExtras(htmlElements.BR),
    mark: stripExtras(htmlElements.Mark),
    code: stripExtras(htmlElements.Code),
    // TODO
    inlineCode: stripExtras(htmlElements.Code),

    pre: stripExtras(htmlElements.Pre),
    time: stripExtras(htmlElements.Time),
    strong: stripExtras(htmlElements.Strong),
    del: stripExtras(htmlElements.Del),
    em: stripExtras(htmlElements.EM),

    hr: stripExtras(htmlElements.HR),

    div: Div,
    span: Text,

    img: Img,
  };
}

function Paragraph({ style, children }) {
  // NOTE(EvanBacon): Unclear why, but mdxjs is wrapping an image in a paragraph tag.
  // This can lead to nesting a div in a p on web, which is invalid.
  const image = React.Children.toArray(children).find((child) => {
    return typeof child === "object" && "props" in child && child.props.src;
  });
  if (image) {
    return <>{children}</>;
  }

  return <Text style={style} children={children} />;
}

function Div(props) {
  return <View {...props} style={[{ flex: 1 }, props.style]} />;
}

function Img({ src, style }) {
  const source = typeof src === "string" ? { uri: src } : src;
  if (Platform.OS === "web" || !source.uri) {
    return <Image source={source} style={style} />;
  }

  return <AutoImage style={style} source={source} />;
}

function stripExtras(Element, displayName?: string) {
  function E({
    firstChild,
    lastChild,
    firstOfType,
    index,
    prevSibling,
    parentName,
    ...props
  }) {
    return React.createElement(Element, props);
  }

  if (displayName != null) {
    E.displayName = displayName;
  } else if (typeof Element === "string") {
    E.displayName = Element;
  } else if ("displayName" in Element) {
    E.displayName = Element.displayName;
  }
  return E;
}

function wrapHeader(Element) {
  return function Header({
    firstChild,
    lastChild,
    firstOfType,
    index,
    prevSibling,
    ...props
  }) {
    const isFirst = index === 0;

    return (
      <Element
        {...props}
        style={[props.style, isFirst ? { marginTop: 0 } : {}]}
      />
    );
  };
}
