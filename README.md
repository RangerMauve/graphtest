# graphtest

Testing out some graph libraries, specifically visualizing a graph written in DOT

Live demo: http://rangermauve.github.io/graphtest/

## About

This program uses [graphlib-dot](https://www.npmjs.org/package/graphlib-dot) for parsing out DOT files, it then passes that off to [dagre](https://github.com/cpettitt/dagre) for the fancy layout. Finally, it all gets fed into a [mustache](https://github.com/janl/mustache.js) template.
The live-updating stuff is provided by [Vue](http://vuejs.org/), and everything is built using [Browserify](http://browserify.org).

## Building

To build the project, make sure you have a recent version of [Node.js](http://nodejs.org/) installed, and added to your path.
Then, after cloning the project run
```
npm install
```
and
```
npm run build
```
This should create a `bundle.js` file, and you can then open up `index.html` in your browser to play around.

## Developing

You can run `npm run watch` to have node watch for changes and auto-rebuild the bundle.
