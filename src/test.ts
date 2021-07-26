import {apply} from './accumulator'

const editing = `
<br>
<ts-mention>@hoge</ts-mention>
<br>
- foo
  + bar
* pon
1. foo
  1. bar
  1. pon
2. kaz
<br>
foo
<br>
foo [hoge](https://github.com/suzuki-hoge) bar [hoge](https://github.com/suzuki-hoge) pon to <ts-mention>@hoge</ts-mention>, <ts-mention>@hoge</ts-mention>
<br>
\`\`\`
- foo
- bar
1. foo [hoge](https://github.com/suzuki-hoge) bar [hoge](https://github.com/suzuki-hoge) pon
@hoge
\`\`\`
<br>
1. foo [hoge](https://github.com/suzuki-hoge) bar [hoge](https://github.com/suzuki-hoge) pon to <ts-mention>@hoge</ts-mention>, <ts-mention>@hoge</ts-mention>
<br>
<br>
`.trim().split('\n').map(s => `<p>${s}</p>`).join('')

const exp = `
<p><ts-mention>@hoge</ts-mention></p>
<p><br></p>
<ul>
<li class="ql-indent-0">foo</li>
<li class="ql-indent-1">bar</li>
<li class="ql-indent-0">pon</li>
</ul>
<ol>
<li class="ql-indent-0">foo</li>
<li class="ql-indent-1">bar</li>
<li class="ql-indent-1">pon</li>
<li class="ql-indent-0">kaz</li>
</ol>
<p><br></p>
<p>foo</p>
<p><br></p>
<p>foo <a href="https://github.com/suzuki-hoge" rel="noopener noreferrer" target="_blank">hoge</a> bar <a href="https://github.com/suzuki-hoge" rel="noopener noreferrer" target="_blank">hoge</a> pon to <ts-mention>@hoge</ts-mention>, <ts-mention>@hoge</ts-mention></p>
<p><br></p>
<p>\`\`\`</p>
<p>- foo</p>
<p>- bar</p>
<p>1. foo [hoge](https://github.com/suzuki-hoge) bar [hoge](https://github.com/suzuki-hoge) pon</p>
<p>@hoge</p>
<p>\`\`\`</p>
<p><br></p>
<ol>
<li class="ql-indent-0">foo <a href="https://github.com/suzuki-hoge" rel="noopener noreferrer" target="_blank">hoge</a> bar <a href="https://github.com/suzuki-hoge" rel="noopener noreferrer" target="_blank">hoge</a> pon to <ts-mention>@hoge</ts-mention>, <ts-mention>@hoge</ts-mention></li>
</ol>
`.trim().split('\n').join('')

const act = apply(editing)
if (exp == act)
    console.log('OK')
else
    console.log(`exp: ${exp}\ngot: ${act}`)
