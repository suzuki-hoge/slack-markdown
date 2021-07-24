import {Match} from './match'
import {MatchFor} from './match-for'

export class Line {
    private readonly texts: Text[] = []
    private continuous: Text | null = null

    constructor(markdown: string) {
        if (Break.isApplicable(markdown)) {
            this.texts.push(new Break(markdown))
        } else {
            markdown.split('').reduce((acc: Line, char: string) => acc.pushChar(char), this).finish()
        }
    }

    private pushChar(char: string): Line {
        // @formatter:off
        new MatchFor(this.continuous, char)
            .case(
                c => c == null, () => new Match(char)
                    .case(Strong.isApplicable,        this.start(Strong))
                    .case(Emphasis.isApplicable,      this.start(Emphasis))
                    .case(Strikethrough.isApplicable, this.start(Strikethrough))
                    .case(Code.isApplicable,          this.start(Code))
                    .case(Anchor.isApplicable,        this.start(Anchor))
                    .otherwise(                       this.start(Plain))
            )
            .case(
                c => c instanceof Plain, () => new Match(char)
                    .case(Strong.isApplicable,        this.switch(Strong))
                    .case(Emphasis.isApplicable,      this.switch(Emphasis))
                    .case(Strikethrough.isApplicable, this.switch(Strikethrough))
                    .case(Code.isApplicable,          this.switch(Code))
                    .case(Anchor.isApplicable,        this.switch(Anchor))
                    .otherwise(                       this.continue())
            )
            .case(
                c => c instanceof Strong, () => new Match(char)
                    .case(Strong.isApplicable,        this.end())
                    .otherwise(                       this.continue())
            )
            .case(
                c => c instanceof Emphasis, () => new Match(char)
                    .case(Emphasis.isApplicable,      this.end())
                    .otherwise(                       this.continue())
            )
            .case(
                c => c instanceof Strikethrough, () => new Match(char)
                    .case(Strikethrough.isApplicable, this.end())
                    .otherwise(                       this.continue())
            )
            .case(
                c => c instanceof Code, () => new Match(char)
                    .case(Code.isApplicable,          this.end())
                    .otherwise(                       this.continue())
            )
            .case(
                c => c instanceof Anchor, () => new Match(char)
                    .case(Anchor.isClosable,          this.end())
                    .otherwise(                       this.continue())
            )
            .otherwise(this.continue())
        // @formatter:on

        return this
    }

    private start(constructor: new(char: string) => Text): (char: string) => void {
        return char => this.continuous = new constructor(char)
    }

    private continue(): (char: string) => void {
        return char => this.continuous?.pushChar(char)
    }

    private end(): (char: string) => void {
        return char => {
            if (this.continuous != null) {
                this.continuous.pushChar(char)
                this.texts.push(this.continuous)
                this.continuous = null
            }
        }
    }

    private switch(constructor: new(char: string) => Text): (char: string) => void {
        return char => {
            if (this.continuous != null) {
                this.texts.push(this.continuous)
                this.continuous = new constructor(char)
            }
        }
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
