export class Line {
    private texts: Text[] = []
    private continuous: Text | null = null

    constructor(markdown: string) {
        if (Break.isApplicable(markdown)) {
            this.texts.push(new Break(markdown))
        } else {
            markdown.split('').reduce((acc: Line, char: string) => acc.pushChar(char), this).finish()
        }
    }

    private pushChar(char: string): Line {
        if (this.continuous == null) {
            if (Strong.isApplicable(char)) {
                this.continuous = new Strong(char)
            } else if (Emphasis.isApplicable(char)) {
                this.continuous = new Emphasis(char)
            } else if (Strikethrough.isApplicable(char)) {
                this.continuous = new Strikethrough(char)
            } else if (Code.isApplicable(char)) {
                this.continuous = new Code(char)
            } else if (Anchor.isApplicable(char)) {
                this.continuous = new Anchor(char)
            } else {
                this.continuous = new Plain(char)
            }
        } else if (this.continuous instanceof Plain) {
            if (Strong.isApplicable(char)) {
                this.texts.push(this.continuous)
                this.continuous = new Strong(char)
            } else if (Emphasis.isApplicable(char)) {
                this.texts.push(this.continuous)
                this.continuous = new Emphasis(char)
            } else if (Strikethrough.isApplicable(char)) {
                this.texts.push(this.continuous)
                this.continuous = new Strikethrough(char)
            } else if (Code.isApplicable(char)) {
                this.texts.push(this.continuous)
                this.continuous = new Code(char)
            } else if (Anchor.isApplicable(char)) {
                this.texts.push(this.continuous)
                this.continuous = new Anchor(char)
            } else {
                this.continuous.pushChar(char)
            }
        } else if (this.continuous instanceof Strong) {
            if (Strong.isApplicable(char)) {
                this.continuous.pushChar(char)
                this.texts.push(this.continuous)
                this.continuous = null
            } else {
                this.continuous.pushChar(char)
            }
        } else if (this.continuous instanceof Emphasis) {
            if (Emphasis.isApplicable(char)) {
                this.continuous.pushChar(char)
                this.texts.push(this.continuous)
                this.continuous = null
            } else {
                this.continuous.pushChar(char)
            }
        } else if (this.continuous instanceof Strikethrough) {
            if (Strikethrough.isApplicable(char)) {
                this.continuous.pushChar(char)
                this.texts.push(this.continuous)
                this.continuous = null
            } else {
                this.continuous.pushChar(char)
            }
        } else if (this.continuous instanceof Code) {
            if (Code.isApplicable(char)) {
                this.continuous.pushChar(char)
                this.texts.push(this.continuous)
                this.continuous = null
            } else {
                this.continuous.pushChar(char)
            }
        } else if (this.continuous instanceof Anchor) {
            if (Anchor.isClosable(char)) {
                this.continuous.pushChar(char)
                this.texts.push(this.continuous)
                this.continuous = null
            } else {
                this.continuous.pushChar(char)
            }
        } else {
            this.continuous.pushChar(char)
        }
        return this
    }

    private finish() {
        if (this.continuous != null) {
            this.texts.push(this.continuous)
            this.continuous = null
        }
    }

    toHtml(): string {
        return this.texts.map(text => text.toHtml()).join('')
    }
}

abstract class Text {
    protected chars: string

    constructor(char: string) {
        this.chars = char
    }

    pushChar(char: string) {
        this.chars += char
    }

    abstract toHtml(): string
}

class Plain extends Text {
    toHtml(): string {
        return this.chars
    }
}

class Strong extends Text {
    static isApplicable(char: string): boolean {
        return char == '*'
    }

    toHtml(): string {
        return `<strong>${this.chars.replace(/\*/g, '')}</strong>`
    }
}

class Emphasis extends Text {
    static isApplicable(char: string): boolean {
        return char == '_'
    }

    toHtml(): string {
        return `<em>${this.chars.replace(/_/g, '')}</em>`
    }
}

class Strikethrough extends Text {
    static isApplicable(char: string): boolean {
        return char == '~'
    }

    toHtml(): string {
        return `<s>${this.chars.replace(/~/g, '')}</s>`
    }
}

class Code extends Text {
    static isApplicable(char: string): boolean {
        return char == '`'
    }

    toHtml(): string {
        return `<code>${this.chars.replace(/`/g, '')}</code>`
    }
}

class Anchor extends Text {
    static isApplicable(char: string): boolean {
        return char == '['
    }

    static isClosable(char: string): boolean {
        return char == ')'
    }

    toHtml(): string {
        const view = this.chars.split('](')[0].replace(/^\[/, '')
        const url = this.chars.split('](')[1].replace(/\)$/, '')
        return `<a href="${url}" rel="noopener noreferrer" target="_blank">${view}</a>`
    }
}

class Break extends Text {
    static isApplicable(char: string): boolean {
        return char.trim() == ''
    }

    toHtml(): string {
        return '<br>'
    }
}
