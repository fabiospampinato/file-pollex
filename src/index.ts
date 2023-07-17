
/* IMPORT */

import type fs from 'node:fs';
import {getFileStat, getFileWatcher} from './utils';
import type {Disposer, Event, Handler, Options} from './types';

/* MAIN */

//TODO: check if "pollex" works over an individual file just the same

const filePollex = ( filePath: string, handler: Handler, options: Options = {} ): Disposer => {

  /* STATE */

  const ignoreInitial = options.ignoreInitial ?? false;
  const ignoreReady = options.ignoreReady ?? false;
  const pollingInterval = options.pollingInterval ?? 1000;

  let initial = true;
  let pollingId: ReturnType<typeof setTimeout> | undefined;
  let statPrev: fs.BigIntStats | undefined;
  let watcherPrev: fs.FSWatcher | undefined;

  /* EVENTS */

  const on = ( event: Event ): void => {

    if ( initial && ignoreInitial && event !== 'ready' ) return;

    if ( ignoreReady && event === 'ready' ) return;

    handler ( event );

  };

  /* REFRESH */

  const refreshStat = (): void => {

    const stat = getFileStat ( filePath );

    if ( stat === false ) return;

    if ( stat ) {

      if ( !statPrev ) {

        on ( 'add' );

        refreshWatch ();

      } else if ( stat.ino !== statPrev.ino || stat.mtimeMs !== statPrev.mtimeMs || stat.size !== statPrev.size ) {

        on ( 'change' );

        if ( stat.ino !== statPrev.ino ) {

          refreshWatch ();

        }

      }

    } else if ( statPrev ) {

      on ( 'unlink' );

      watcherPrev?.close ();

    }

    statPrev = stat;

  };

  const refreshWatch = (): void => {

    watcherPrev?.close ();
    watcherPrev = getFileWatcher ( filePath, refreshStat );

  };

  /* LIFECYCLE */

  const loop = (): void => {

    refreshStat ();

    pollingId = setTimeout ( loop, pollingInterval );

  };

  const start = (): void => {

    initial = true;

    loop ();

    on ( 'ready' );

    initial = false;

  };

  const stop = (): void => {

    clearTimeout ( pollingId );

    watcherPrev?.close ();

  };

  /* RETURN */

  start ();

  return stop;

};

/* EXPORT */

export default filePollex;
