import {Blocks} from './block'

export function apply(editing: string): string {
    return editing
        .replace(/<p>/g, '')
        .replace(/<\/p>/g, '\n')
        .trim().split('\n')
        .reduce((acc, markdown) => acc.pushMarkdown(markdown), new Blocks())
        .finish()
        .toHtml()
}

document.onkeydown = event => {
    if (event.code == 'Space' && event.metaKey) {
        let editor = document.getElementsByClassName('ql-editor')[0]
        let editing = editor.innerHTML

        editor.innerHTML = apply(editing)
    }
}
