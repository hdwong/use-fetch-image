import { useState, useEffect } from "react";

const aborts = {};

export function useImage(src) {
  const [ imageState, setImageState ] = useState([ undefined, 'loading' ]);
  const [ percentage, setPercentage ] = useState(0);

  useEffect(() => {
    // reset states
    setImageState([ undefined, 'loading' ]);
    setPercentage(0);
    if (!src) {
      return;
    }

    // add an abort controller
    const abort = new AbortController();
    aborts[src] = abort;
    fetch(`${src}?crossorigin`, { signal: abort.signal })
        .then(async res => {
          const reader = res.body?.getReader();
          if (!reader) {
            throw new Error('Unable to get the response reader');
          }
          // read data from body
          const length = parseInt(res.headers.get('content-length'), 10);
          let loaded = 0;
          const chunks = [];
          while (true) {
            const { done, value } = await reader.read();
            if (done || !value) {
              setPercentage(1);
              break;
            }
            chunks.push(value);
            loaded += value.length;
            // update progress
            if (length) {
              setPercentage(loaded / length);
            }
          }
          // remove abort controller after image loaded
          delete aborts[src];

          // create image object
          var img = document.createElement('img');
          function cleanup() {
            img.removeEventListener('load', onload);
            img.removeEventListener('error', onerror);
          };
          function onload() {
            // done
            setImageState([ img, 'loaded' ]);
            cleanup();
          }
          function onerror() {
            // error
            setImageState([ undefined, 'error' ]);
            cleanup();
          }
          img.addEventListener('load', onload);
          img.addEventListener('error', onerror);
          // set image.src to the ObjectURL created from blob
          img.src = window.URL.createObjectURL(new Blob(chunks));
        }).catch(e => {
          // error
          setImageState([ undefined, 'error' ]);
        });

    return () => {
      // cancel the request
      aborts[src] && aborts[src].abort();
    };
  }, [ src ]);

  return [ imageState[0], imageState[1], percentage ];
}
