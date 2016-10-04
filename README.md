# Pencil for tape

A small helper for [tape](https://github.com/substack/tape) to inject dependencies into your tests.

## Install

```npm install tape-pencil --save-dev```

## Example

```
import testWithProvision from 'tape-pencil';

function provideDependencies() {
  return [{foo: 'bar'}, someDependency()];
}

testWithProvision(provideDependencies, 'Test this or that', (t, dependencyOne, dependencyTwo) => {
  // dependencyOne: ({foo: 'bar'}) and dependencyTwo: (the return value of someDependency())
  // are now available in your test
});
```

## Licence

[MIT](./LICENSE)
