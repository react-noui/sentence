# sentence
[![gzip size](https://img.badgesize.io/https://unpkg.com/react-noui/sentence?compression=gzip&amp;style=flat-square)](https://unpkg.com/react-noui/sentence)
[![npm version](https://img.shields.io/npm/v/react-noui/sentences.svg?style=flat-square)](https://www.npmjs.com/package/react-noui/sentence)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

`sentence` is a simple state tracker for a number you want to add to.

# Installation
```bash
yarn add @react-noui/sentence
```
Or with `npm`
```bash
npm install --save @react-noui/sentence
```

# Example
This example shows how you can track different values.
```jsx
import { createCounter } from '@react-noui/sentence';
// Tracks the total number of clicks within it.
const ClickCounter = createCounter();
// Tracks the total async time spent in ms.
const AsyncTimer = createCounter();

function App() {
  return (
    <AsyncTimer.Provider>
      <ClickCounter.Provider>
        TOTAL CLICKS <ShowClicks />
        <ClickCounter.Provider>
          CLICK A TOTAL: <ShowClicks />
          <AddButton>Button A</AddButton>
        </ClickCounter.Provider>
        <ClickCounter.Provider>
          CLICK B TOTAL: <ShowClicks />
          <AddButton>Button B</AddButton>
        </ClickCounter.Provider>
      </ClickCounter.Provider>
    </AsyncTimer.Provider>
  )
}

function ShowClicks() {
  const { count } = useCounter(ClickCounter);
  return <span>{count}</span>
}
function AddButton({children}) {
  const { add: addClick } = useCounter(ClickCounter);
  const { add: addTime } = useCounter(AsyncTimer);
  const handleClick = useCallback(() => {
    const backThen = Date.now();
    addClick();
    fetch('/stuff').then(() => {
      addTime(Date.now() - backThen);
    });
  }, [addClick, addTime]);
  return <button onClick={handleClick}>{children}</button>;
}
```
In the above example, clicking `Button A` will add `1` to the totals of `CLICK A TOTAL`, and `TOTAL CLICKS`. Likewise clicking `Button B` will update the totals of `CLICK B TOTAL` and `TOTAL CLICKS`. Any nested `ClickCounter.add` call will update the total of itself _and_ any composed parents.

---
# Docs

## `const MyCounter = createCounter()`

Creates a custom, nestable React `Context` and `Provider`.

**Returns**
```typescript
{
  Context: React.Context<{
    add: (n: number = 1) => void;
    count: number;
  }>
  Provider: (props: React.PropsWithChildren) => React.JSX.Element;
}
```
**Use**
```jsx
import { createCounter } from '@react-noui/sentence';

export const MyCounter = createCounter();
export function MyCountedThing() {
  return (
    <MyCounter.Provider>
      {/**/}
    </MyCounter.Provider>
  )
}
```

## `useCounter(MyCounter)`

React hook and shortcut to `React.useContext(MyCounter.Context)`.

**Returns**

```typescript
const context: {
  count: number;
  add: (n: number = 1) => void;
} = useCounter(MyCounter);
```

**Use**
```jsx
function ShowMyCount() {
  const { count, add } = useCounter(MyCounter);
  return (
    <button onClick={() => add()}>
      I've been clicked {count} times
    </button>
  );
}
```

