# use-fetch-image
React hook for fetch an image with the download percentage.

[Demo](https://codepen.io/hdwong/pen/jOGyoZx)

## Install
Yarn
```
yarn add use-fetch-image
```

NPM
```
npm install use-fetch-image
```

## Usage
```js
import { useImage } from "use-fetch-image";

export default () => {
  const url = 'https://picsum.photos/400/300';  // demo picture
  const [ image, status, progress ] = useImage(url);

  return (!!image && status === 'loaded') ? (
    <img src={image.src} alt="use-image" />
  ) : (
    <div>Loading... ({(progress * 100) << 0}%)</div>
  );
}
```

## API
| Returns    | Desc |
|------------|------|
| `image`    | the image DOM element or `undefined` before image is loaded |
| `status`   | the download status, including `"loading"`, `"loaded"`, `"error"` |
| `progress` | the download percentage, it is a floating point number, from `0` to `1` |

> **Note**\
`progress` calculation depends on the `content-length` value in the HTTP header.\
Some image servers will not set `content-length` in the HTTP header when responding.\
At this time, the progress will be set to `1` when the download status is `"loaded"`.

> **Note**\
This hook is fully compatible with [use-image](https://www.npmjs.com/package/use-image) in `konvajs`.

## License
MIT
