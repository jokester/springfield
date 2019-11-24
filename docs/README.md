# springfield / 春田

A declarative shared element transition library for React.

---

[![npm version](https://badge.fury.io/js/springfield.svg)](https://badge.fury.io/js/springfield)

## Demo

[demo](https://jokester.github.io/springfield/demo) / [src](https://github.com/jokester/springfield/tree/develop/demo)

## Install

```
$ npm install --save springfield

OR

$ yarn add springfield
```

## Getting started

The simplest usage of `springfield` is to wrap 2 DOM elements with `<SharedElement>` component,
specifying identical "logicalId" and different "instanceId" to them:

```tsx
<SharedElement logicalId="user" instanceId="icon">
    <div className="user-icon" />
</SharedElement>

// and in a distinct place
<SharedElement logicalId="user" instanceId="avatar" isTarget>
    <div className="user-avatar" />
</SharedElement>
```

## How it works

`springfield` works by rendering DOM elements with appropriate inline styles.
These styles typically contain CSS `opacity` `transform` `transition`.

We recommended to read [FLIP Your Animations](https://aerotwist.com/blog/flip-your-animations/) first.
`springfield` is but `first-last-invert-play` animation implemented for React.

In the _Getting Started_ example, when `<div className="user-avatar" />` comes into VDOM tree,
`springfield` renders the `<div />` inside with a few inline styles, to cause the transition.

Details:

1. render with `{ opacity: 0 }` to obtain its _last_ position, where it should be when transition ends.
2. find a position snapshot of same `logicalId` but different `instanceId`, and use it as the _first_ position
3. render with a _inverted transform_ `{ transform: ... }` to make the real element appear at _first_ position
4. after the _inverted transform_ gets layouted, render with `{ transition: ... }` (unset `transform` and set `transition`) to kick off the transition
5. reset style to `undefined` after `transitionend` event fired on the DOM element.

## Customization

### `transition`

`SharedElement` accepts a optional `transition` property (string).
When specified, it will be used instead of default `all 0.3s ease-in`;

### complicated jsx / on-need update or removal of snapshots

`SharedElement` supports the render-function-as-children idiom.

```tsx
<SharedElement logicalId="user" instanceId="icon">
  <div className="user-icon" />
</SharedElement>;

/* is equalivent to */

<SharedElement logicalId="user" instanceId="icon">
  {(style, callbacks, phase, ref) => <div className="user-icon" style={style} ref={ref} />}
</SharedElement>;
```

See [RenderPropsChildren](src/shared-elem.ts) type for explanation of these parameters.

### Snapshot strategy and transition styles

The default snapshot strategy (what position to use as starti of transition) and styles (scale / transform only)
can be overridden by passing an object that implemented [SpringfieldDelegate](src/delegate.ts) API to `SpringfieldContext`.

See [defaultSpringfieldDelegate](src/default-delegate.ts) for the default implementation.

## Contributing

Feel free to drop issues / PRs if you want to do something.

## What's in a name

We named it springfield, because in a shared element transition,
element moves as if it were pulled by an invisible spring-like field
---- and this imagination constitutes a bad pun joke.

## License

MIT
