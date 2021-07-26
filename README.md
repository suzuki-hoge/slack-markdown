# slack markdown
chrome extension for convert editing markdown to html, for slack.

## run and specs
edit markdown.
![スクリーンショット 2021-07-26 23 19 39](https://user-images.githubusercontent.com/18749992/127004643-49a7ea5d-ccff-4139-b461-bd6ae58396a4.png)

input `cmd + Space` before submit. will be converted.
![スクリーンショット 2021-07-26 23 20 00](https://user-images.githubusercontent.com/18749992/127004653-9e32f358-22df-402f-ae8a-1d0aa7532870.png)

submit and preview.
![スクリーンショット 2021-07-26 23 20 34](https://user-images.githubusercontent.com/18749992/127004656-556648b0-49cd-468b-8405-418eb29164f6.png)

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

