
/* IMPORT */

import {describe} from 'fava';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {setTimeout as delay} from 'node:timers/promises';
import filePollex from '../dist/index.js';

/* MAIN */

describe ( 'File Pollex', it => {

  it ( 'works', async t => {

    const FILE_PATH = path.join ( process.cwd (), '_file.txt' );

    const events = [];

    const dispose = filePollex ( FILE_PATH, event => events.push ( event ), {
      ignoreInitial: true,
      ignoreReady: false,
      pollingInterval: 400
    });

    /* READY */

    t.deepEqual ( events.shift (), 'ready' );

    /* FILE EVENTS */

    for ( let i = 0; i < 3; i++ ) {

      /* ADD */

      fs.writeFileSync ( FILE_PATH, 'test' );

      await delay ( 500 );

      t.deepEqual ( events.shift (), 'add' );

      /* CHANGE */

      fs.writeFileSync ( FILE_PATH, 'test2' );

      await delay ( 50 );

      t.deepEqual ( events.shift (), 'change' );

      /* CHANGE */

      fs.writeFileSync ( FILE_PATH, 'test3' );

      await delay ( 50 );

      t.deepEqual ( events.shift (), 'change' );

      /* UNLINK */

      fs.unlinkSync ( FILE_PATH );

      await delay ( 50 );

      t.deepEqual ( events.shift (), 'unlink' );

    }

    /* DISPOSE */

    dispose ();

  });

});
