
/* IMPORT */

import fs from 'node:fs';
import type {Callback} from './types';

/* MAIN */

const getFileStat = ( filePath: string ): fs.BigIntStats | false | undefined => {

  try {

    const stat = fs.statSync ( filePath, { bigint: true } );

    if ( !stat.isFile () ) return;

    return stat;

  } catch ( error: unknown ) {

    if ( error instanceof Error && error['code'] === 'ENOENT' ) return;

    return false;

  }

};

const getFileWatcher = ( filePath: string, callback: Callback ): fs.FSWatcher | undefined => {

  try {

    return fs.watch ( filePath, { persistent: false }, callback );

  } catch {

    return;

  }

};

/* EXPORT */

export {getFileStat, getFileWatcher};
