import React, {
  AnchorHTMLAttributes,
  Fragment,
  HTMLAttributes,
  useMemo,
} from 'react';

function makeSentenceSegment(
  segment: SentenceSegment,
  i: number,
  arr: SentenceSegment[],
): JSX.Element {
  const space = i === arr.length - 1 ? null : ' ';
  let node: JSX.Element = <></>;
  const key = `segment_${i}`;
  if (isSentenceSegmentElement(segment) || isSentenceSegmentText(segment)) {
    node = <>{segment}</>;
  }
  if (isSentenceSegmentAnchor(segment)) {
    const [text, attributes] = segment;
    node = <a {...attributes}>{text}</a>;
  }
  if (isSentenceSegmentWrap(segment)) {
    const [text, tag, attributes = {}] = segment;
    node = React.createElement(tag, attributes, text);
  }
  return (
    <Fragment key={key}>
      {node}
      {space}
    </Fragment>
  );
}

export function isSentenceSegmentText(
  segment: SentenceSegment,
): segment is string {
  return typeof segment === 'string';
}

export function isSentenceSegmentElement(
  segment: SentenceSegment,
): segment is JSX.Element {
  if (isSentenceSegmentText(segment)) return false;
  return typeof segment === 'object' && Object.keys(segment).includes('props');
}

export function isSentenceSegmentAnchor(
  segment: SentenceSegment,
): segment is SentenceSegmentAnchor {
  if (isSentenceSegmentText(segment)) return false;
  if (isSentenceSegmentElement(segment)) return false;
  return (
    segment.length === 2 &&
    typeof segment[1] === 'object' &&
    Object.keys(segment[1]).includes('href')
  );
}

export function isSentenceSegmentWrap(
  segment: SentenceSegment,
): segment is SentenceSegmentWrap {
  if (isSentenceSegmentText(segment)) return false;
  if (isSentenceSegmentElement(segment)) return false;
  if (isSentenceSegmentAnchor(segment)) return false;
  return SENTENCESEGMENTSUPPORTEDTAGS.includes(segment[1]);
}

export function makeSentence(segments?: SentenceSegment[]) {
  if (!segments) return <></>;
  return <>{segments.map(makeSentenceSegment)}</>;
}

export function useSentence(segments: SentenceSegment[]) {
  return useMemo(() => makeSentence(segments), [segments]);
}

type RequiredAnchorAttributes = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};
type SentenceSegmentAnchor =
  | [string, RequiredAnchorAttributes]
  | [JSX.Element, RequiredAnchorAttributes];

type SentenceSegmentWrap =
  | [string, keyof SupportedIntrinsicElements]
  | [string, keyof SupportedIntrinsicElements, HTMLAttributes<HTMLElement>]
  | [JSX.Element, keyof SupportedIntrinsicElements]
  | [
      JSX.Element,
      keyof SupportedIntrinsicElements,
      HTMLAttributes<HTMLElement>,
    ];

export type SentenceSegment =
  | string
  | JSX.Element
  | SentenceSegmentAnchor
  | SentenceSegmentWrap;

export type SupportedIntrinsicElements = Pick<
  JSX.IntrinsicElements,
  SentenceSegmentSupportedTags
>;

export type SentenceSegmentSupportedTags =
  (typeof SENTENCESEGMENTSUPPORTEDTAGS)[number];

const SENTENCESEGMENTSUPPORTEDTAGS = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'big',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'center',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'keygen',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'menu',
  'menuitem',
  'meta',
  'meter',
  'nav',
  'noindex',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'slot',
  'script',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'template',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
] as const;
