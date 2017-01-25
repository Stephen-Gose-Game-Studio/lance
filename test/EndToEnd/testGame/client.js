'use strict';

const incheon = require('../../../');
const MyClientEngine = require('./src/client/MyClientEngine');
const MyGameEngine = require('./src/common/MyGameEngine');
const SimplePhysicsEngine = incheon.physics.SimplePhysicsEngine;
const search = (typeof location === 'undefined') ? {} : location.search;
const qsOptions = require('query-string').parse(search);

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: 1,
    delayInputCount: 3,
    clientIDSpace: 1000000,
    syncOptions: {
        sync: qsOptions.sync || 'extrapolate',
        localObjBending: 0.0,
        remoteObjBending: 0.8,
        bendingIncrements: 6
    }
};
const testDefaults = {
    traceLevel: 0,
    serverURL: 'http://127.0.0.1:3000',
    socket: { multiplex: false, forceNew: true }
};
let options = Object.assign(defaults, testDefaults, qsOptions);

// create a client engine and a game engine
const physicsEngine = new SimplePhysicsEngine();
const gameOptions = Object.assign({ physicsEngine }, options);
const gameEngine = new MyGameEngine(gameOptions);
const clientEngine = new MyClientEngine(gameEngine, options);

function start() {
    clientEngine.start();
    let promise = clientEngine.connect();
    return { clientEngine, gameEngine, gameOptions, physicsEngine, promise };
}

// in a browser environment we auto-start
// in a node environment we return a start method
if (typeof document === 'undefined') {
    module.exports = { start };
} else {
    document.addEventListener('DOMContentLoaded', start);
}
