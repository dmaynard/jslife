<div align="center">

  <h1><code>Javascipt Portion of Game of Life</code></h1>

<strong>The JavaScript portion of my version of the code from https://rustwasm.github.io/docs/book/ I added some features not in the tutorial. This version links to an npm public, scoped npm package @davidsmaynard/wasm-game-of-life</strong>

</div>

## About

### Build

npm run build

### Compile and serve on localhost:8080

npm run start

### Note to use local version of rust module

#### in index.js

```
import { Universe, Cell } from "wasm-game-of-life";
import { memory } from "wasm_game_of_life_bg";
```

#### in package.json

```
"dependencies": {
    "wasm-game-of-life": "file:../pkg"
  },
```

### To use npm version of rust module

#### in index.js

```
import { Universe, Cell } from "@davidsmaynard/wasm-game-of-life";
import { memory } from "@davidsmaynard/wasm-game-of-life/wasm_game_of_life_bg";
```

#### in package.json

```
"dependencies": {
    "@davidsmaynard/wasm-game-of-life": "^0.1.2"
  },
```
