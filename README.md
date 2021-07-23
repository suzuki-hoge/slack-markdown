# slack markdown
chrome extension for convert editing markdown to html, for slack.

## run and specs
### text decoration
edit markdown.

```
plain text
*strong* text
_emphasis_ text
~strike through~ text
`code` text
[anchor](https://github.com/suzuki-hoge) link
```

input `cmd + Space` before submit. will be converted.

![スクリーンショット 2021-07-24 1 01 27](https://user-images.githubusercontent.com/18749992/126809845-484c31f1-5015-4684-b703-2364c6bfd787.png)

### multi line decoration
able to convert multi line block too.
of course, the text inside the block is also converted.

````
> quote block
> effective marker is `> `

1. ordered list
2. any line number is effective
  1. indent is 2 spaces
    1. indent is 2 spaces
  1. text *decoration* is `also` [effective](https://github.com/suzuki-hoge)

+ unordered list
  - effective markers are `+` or `-`

```
const n: number = 42
console.log(n)
```
````

![スクリーンショット 2021-07-24 1 05 10](https://user-images.githubusercontent.com/18749992/126810186-bee09f7f-79c7-4d97-99c6-8d9573f0fb4a.png)

## for dev
### init
```
npm install --save-dev webpack webpack-cli copy-webpack-plugin

npm install --save-dev typescript ts-loader

npm install --save-dev @types/chrome
```

### build
```
npx webpack --mode production
```

### deploy
load `dist/` on chrome

### classes
summary for classes.

![classes](./classes.png)

### test
run [test.ts](./src/test.ts)

