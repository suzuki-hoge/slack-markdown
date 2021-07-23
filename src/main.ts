import {apply} from './converter'

document.onkeydown = event => {
    if (event.code == 'Space' && event.metaKey) {
        let editor = document.getElementsByClassName('ql-editor')[0]
        let editing = editor.innerHTML

        editor.innerHTML = apply(editing)
    }
}
