# wing-cms-filter


### Test (jest)

```bash
npm update
npm test
```


### Build (rollup.js)

```bash
npm run build
```


### Usage

#### Browser

CDN:
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/pb-it/wing-cms-filter@0.1.3-alpha/dist/jpath.min.js"></script>
```

```javascript
var filtered_arr = jPath(arr, '$.[?(@.id >= 5)]');
```


### Documentation

[Selector](./docs/selector.md)

> Examples can be found in the tests: `tests/test.js`