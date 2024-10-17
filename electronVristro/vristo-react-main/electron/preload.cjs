// preload.js
import { contextBridge } from 'electron';
import path from 'path';

contextBridge.exposeInMainWorld('electron', {
    path: {
        join: (...args) => path.join(...args),
    },
});
