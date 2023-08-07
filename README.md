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
A `SentenceSegment` describes the composition of a part of a sentence.
```tsx
const segments: SentenceSegment[] = [
  'just a string',
  ['italic string wrapped in "i" tag', 'i'],
  [<i>italic element wrapped in {'"'}b{'"'} tag</i>, 'b'],
  [<i>italic element wrapped in {'"'}b{'"'} tag</i>, 'b', { 'aria-label': 'foobar' }],
  ['text for an anchor tag', { href: 'abc.com' }],
  [<i>italic element wrapped in anchor tag</i>, { href: 'abc.com' }],
]
```
A sentence can be composed by memoizing the returned sentence segments.
```tsx
type User = {
  name: string;
  email?: string;
  website?: string;
}
function UserDescription({ user }: { user: User }) {
  const userDescription = useUserDescription(user);
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{userDescription}</p>
    </div>
  )
}

function useUserDescription(user: User) {
  return useMemo(() => {
    let segments: SentenceSegment[] = [];
    if (user.email) {
      segments.push([`Email me ${user.email}`, { href: `mailto:${user.email}` }]);
    }
    return makeSentence(segments);
  }, [user]);
}
```
