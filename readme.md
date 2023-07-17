# File Pollex

A tiny hybrid filesystem watcher for a single file.

This uses a combination of native filesystem watching and polling to be simultaneously reliable, responsive, and tiny.

For more complicated use cases than just watching a single file check out [`pollex`](https://github.com/fabiospampinato/pollex) and [`watcher`](https://github.com/fabiospampinato/watcher).

## Install

```sh
npm install --save file-pollex
```

## Usage

```ts
import watchFile from 'file-pollex';

// Let's define some options

const watchOptions = {
  ignoreInitial: true, // Ignore the initial "add" event that may be emitted while the file path is being polled for the first time
  ignoreReady: true, // Ignore the "ready" event, useful in combination with "ignoreInitial: true" to only get notified about actual changes
  pollingInterval: 1000 // Poll the file path on this interval, to more reliably detect "add" and "unlink" events
};

// Let's listen for events

watch ( 'foo.txt', event => {

  if ( event === 'add' ) {

    // The file got added

  } else if ( event === 'change' ) {

    // The file got changed

  } else if ( event === 'ready' ) {

    // The initial polling has been done and the eventual initial "add" event has been emitted

  } else if ( event === 'unlink' ) {

    // The file got deleted

  }

}, watchOptions );
```

## License

MIT © Fabio Spampinato
