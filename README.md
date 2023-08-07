# sentence
[![gzip size](https://img.badgesize.io/https://unpkg.com/react-noui/sentence?compression=gzip&amp;style=flat-square)](https://unpkg.com/react-noui/sentence)
[![npm version](https://img.shields.io/npm/v/react-noui/sentences.svg?style=flat-square)](https://www.npmjs.com/package/react-noui/sentence)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

`sentence` is a simple state tracker for a number you want to add to.
Full typescript support.

# Installation
```bash
yarn add @react-noui/sentence
```
Or with `npm`
```bash
npm install --save @react-noui/sentence
```

# Examples

### Static sentence component
```tsx
import { makeSentence } from '@react-noui/sentence'

const SupportSentence = makeSentence(
  [
    'Please visit our',
    ['support page', { href: 'https://example.com/support' }],
    'or email our',
    ['support team', { href: 'mailto:support@domain.com' }],
    'for assistance.',
  ]
);

function ErrorPage({ error }: { error: Error }) {
  return (
    <div>
      {`${error}`}
      <SupportSentence />
    </div>
  )
}
```

### Dynamic sentence hook
```tsx
import { useSentence } from '@react-noui/sentence'
import { Link } from 'react-router'

interface DataItemLocal {
  name: string;
  localPath: string;
}
interface DataItemExternal {
  name: string;
  href: string;
}
type DataItem = DataItemLocal | DataItemExternal | string;
const isExternal = (data: DataItem): data is DataItemExternal => Boolean(data.href);

function HumanizeInput({ dataItems }: { dataItems: DataItem[] }) {
  return useSentence(
    useMemo(() => dataItems.map((data) => {
      if (typeof data === 'string') return data;
      if (isExternal(data)) return [data.name, { href: data.href }]
      return <Link key={data.name} to={data.localPath}>{data.name}</Link>
    }), [dataItems])
  );
}

function References() {
  const books: DataItem[] = useBookData();
  return (
    <div>
      <h1>References of books</h1>
      <HumanizeInput dataItems={books} />
    </div>
  )
}
```

# API

### `makeSentence(segments?: SentenceSegment[]): JSX.Element`
```tsx
const segments: SentenceSegment[] = [
  'just a string',
  ['italic', 'i'],
  [<i>italic and bold</i>, 'b'],
]
```
