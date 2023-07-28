import { render } from '@testing-library/react';
import React from 'react';

import {
  SentenceSegment,
  buildSentence,
  isSentenceSegmentAnchor,
  isSentenceSegmentElement,
  isSentenceSegmentGeneral,
  isSentenceSegmentText,
  useSentence,
} from '..';

const TestElement = () => <>string</>;

describe('isSentenceSegmentText', () => {
  test.each<{
    segment: SentenceSegment;
    expected: boolean;
  }>([
    {
      segment: 'string value',
      expected: true,
    },
    {
      segment: <TestElement />,
      expected: false,
    },
    {
      segment: ['google.com', { href: 'https://www.google.com' }],
      expected: false,
    },
    {
      segment: ['ITALIC', 'i'],
      expected: false,
    },
    {
      segment: ['ITALIC', 'i', { 'aria-busy': 'true' }],
      expected: false,
    },
  ])('$segment should be $expected', ({ segment, expected }) => {
    expect(isSentenceSegmentText(segment)).toEqual(expected);
  });
});

describe('isSentenceSegmentElement', () => {
  test.each<{
    segment: SentenceSegment;
    expected: boolean;
  }>([
    {
      segment: 'string value',
      expected: false,
    },
    {
      segment: <TestElement />,
      expected: true,
    },
    {
      segment: ['google.com', { href: 'https://www.google.com' }],
      expected: false,
    },
    {
      segment: ['ITALIC', 'i'],
      expected: false,
    },
    {
      segment: ['ITALIC', 'i', { 'aria-busy': 'true' }],
      expected: false,
    },
  ])('$segment should be $expected', ({ segment, expected }) => {
    expect(isSentenceSegmentElement(segment)).toEqual(expected);
  });
});

describe('isSentenceSegmentAnchor', () => {
  test.each<{
    segment: SentenceSegment;
    expected: boolean;
  }>([
    {
      segment: 'string value',
      expected: false,
    },
    {
      segment: <TestElement />,
      expected: false,
    },
    {
      segment: ['google.com', { href: 'https://www.google.com' }],
      expected: true,
    },
    {
      segment: ['ITALIC', 'i'],
      expected: false,
    },
    {
      segment: ['ITALIC', 'i', { 'aria-busy': 'true' }],
      expected: false,
    },
  ])('$segment should be $expected', ({ segment, expected }) => {
    expect(isSentenceSegmentAnchor(segment)).toEqual(expected);
  });
});

describe('isSentenceSegmentGeneral', () => {
  test.each<{
    segment: SentenceSegment;
    expected: boolean;
  }>([
    {
      segment: 'string value',
      expected: false,
    },
    {
      segment: <TestElement />,
      expected: false,
    },
    {
      segment: ['google.com', { href: 'https://www.google.com' }],
      expected: false,
    },
    {
      segment: ['ITALIC', 'i'],
      expected: true,
    },
    {
      segment: ['ITALIC', 'i', { 'aria-busy': 'true' }],
      expected: true,
    },
  ])('$segment should be $expected', ({ segment, expected }) => {
    expect(isSentenceSegmentGeneral(segment)).toEqual(expected);
  });
});

describe('buildSentence', () => {
  test('without arguments', () => {
    expect(buildSentence()).toEqual(<></>);
  });

  test('returns a sentence text', () => {
    const Sentence = () => <>{buildSentence(['one', 'two'])}</>;
    const { getByText } = render(<Sentence />);
    expect(getByText('one two')).toBeTruthy();
  });

  test('returns a sentence elements', () => {
    const One = () => <>one</>;
    const Two = () => <>two</>;
    const Sentence = () => (
      <>{buildSentence([<One key="one" />, <Two key="two" />])}</>
    );
    const { getByText } = render(<Sentence />);
    expect(getByText('one two')).toBeTruthy();
  });

  test('returns a sentence element, text, anchor, and span', () => {
    const One = () => <>one</>;
    const Sentence = () => (
      <>
        {buildSentence([
          <One key="one" />,
          'two',
          ['click', 'b'],
          ['the following:', 'i', { tabIndex: -1 }],
          ['anchor text', { href: 'www.google.com' }],
        ])}
      </>
    );
    const { getByText, container } = render(<Sentence />);
    expect(container.querySelector('a[href="www.google.com"]')).toBeTruthy();
    expect(container.querySelector('i')).toBeTruthy();
    expect(container.querySelector('b')).toBeTruthy();
    expect(getByText('one two')).toBeTruthy();
    expect(getByText('click')).toBeTruthy();
    expect(getByText('the following:')).toBeTruthy();
    expect(getByText('anchor text')).toBeTruthy();
  });
});

describe('useSentence', () => {
  test('returns buildSentence', () => {
    const One = () => <>one</>;
    const Sentence = () => {
      const sentence = useSentence([
        <One key="one" />,
        'two',
        ['click', 'b'],
        ['the following:', 'i', { tabIndex: -1 }],
        ['anchor text', { href: 'www.google.com' }],
      ]);
      return <>{sentence}</>;
    };
    const { getByText, container } = render(<Sentence />);
    expect(container.querySelector('a[href="www.google.com"]')).toBeTruthy();
    expect(container.querySelector('i')).toBeTruthy();
    expect(container.querySelector('b')).toBeTruthy();
    expect(getByText('one two')).toBeTruthy();
    expect(getByText('click')).toBeTruthy();
    expect(getByText('the following:')).toBeTruthy();
    expect(getByText('anchor text')).toBeTruthy();
  });
});
