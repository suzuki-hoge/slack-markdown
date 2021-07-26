import {apply} from './converter'

const editing = `

<ts-mention bla bla bla>@hoge</ts-mention>

&gt; ほげぇ
&gt; \`hoge\` を 42 にする

1. まず *ほげぇ* します
2. 次に _ほげぇ_ します
  1. ほげを ~ほげ~ して \`ほげ\` します
+ 参考資料
  - [doc1](https://github.com/suzuki-hoge)
  - [doc2](https://github.com/suzuki-hoge)
+ 備考
  + ほげぇ
    
ほげを *ほげ* して _ほげ_ してから ~ほげ~ を \`ほげ\` にすると [こう](https://github.com/suzuki-hoge) なります
\`\`\`
let n: number = 42
console.log(n)
\`\`\`


`.split('\n').map(s => `<p>${s}</p>`).join('')

const exp = `
<p><ts-mention bla bla bla>@hoge</ts-mention></p>
<p><br></p>
<blockquote>ほげぇ</blockquote>
<blockquote><code>hoge</code> を 42 にする</blockquote>
<p><br></p>
<ol>
<li class="ql-indent-0">まず <strong>ほげぇ</strong> します</li>
<li class="ql-indent-0">次に <em>ほげぇ</em> します</li>
<li class="ql-indent-1">ほげを <s>ほげ</s> して <code>ほげ</code> します</li>
</ol>
<ul>
<li class="ql-indent-0">参考資料</li>
<li class="ql-indent-1"><a href="https://github.com/suzuki-hoge" rel="noopener noreferrer" target="_blank">doc1</a></li>
<li class="ql-indent-1"><a href="https://github.com/suzuki-hoge" rel="noopener noreferrer" target="_blank">doc2</a></li>
<li class="ql-indent-0">備考</li>
<li class="ql-indent-1">ほげぇ</li>
</ul>
<p><br></p>
<p>ほげを <strong>ほげ</strong> して <em>ほげ</em> してから <s>ほげ</s> を <code>ほげ</code> にすると <a href="https://github.com/suzuki-hoge" rel="noopener noreferrer" target="_blank">こう</a> なります</p>
<div class="ql-code-block">let n: number = 42</div>
<div class="ql-code-block">console.log(n)</div>
`.trim().split('\n').join('')

const act = apply(editing)
if (exp == act)
    console.log('OK')
else
    console.log(`exp: ${exp}\ngot: ${act}`)
