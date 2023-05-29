# Musical Bingo

This website was created to facilitate the creation and running of musical bingo rounds at a pub.

After playing this game at a bar in Sydney, I thought it would be a good idea to bring it home.

# How It Works

To use this website, someone using it needs a spotify developer client id, obtainable from [here](https://developer.spotify.com/documentation/web-api/tutorials/getting-started#create-an-app)

Follow the tutorial to create a spotify app, and copy the client ID once it is done.

After creating the app, you need to assign the valid redirect URL's to wherever this is being hosted. For my purposes, My redirect urls are localhost:5173 (for testing purposes) and wilsam239.github.io/musical-bingo/

You can then go to wherever you are running the site, enter the client id you copied before, and then hit "Login". This will take you to spotify's oauth page, where you must login as your personal spotify user. (this is required to create playlists)

Once logged in, you need to enter the playlist link that you will be taking the selection of songs from, as well as the number of pages to generate. You can also enter a subtitle for the sheets if you would like to.

Now hit "Generate Bingo", and wait to be navigated to the generated bingo sheets.

# The Playlist

After entering the playlist url and generating bingo, a playlist will be created called "Musical Bingo - <Todays Date>" under your personal spotify profile. This playlist contains the 25 songs used on the bingo sheets.

These playlists are not automatically cleared, so if you wish to remove them after use, do so yourself.

# The Code

Written by Sam Williamson (for better or for worse) 2023.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
