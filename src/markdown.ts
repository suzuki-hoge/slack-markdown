export abstract class Markdown {
    protected readonly lines: string[]

    constructor(lines: string[]) {
        this.lines = lines;
    }

    abstract toHtml(): string

    protected toTag(name: string, content: string, classes?: string): string {
        const attr = classes == null ? '' : ` class="${classes}"`
        return `<${name}${attr}>${content}</${name}>`
    }

    protected fixAnchor(line: string): string {
        return line.replace(/(\[([^\]]+)]\(([^)]+)\))/g, '<a href="$3" rel="noopener noreferrer" target="_blank">$2</a>')
    }

    protected liMaker(prefix: RegExp): (line: string) => string {
        return line => this.toTag('li', line.replace(prefix, ''), `ql-indent-${(line.length - line.replace(/\s*/, '').length) / 2}`)
    }
}

export class UnorderedList extends Markdown {
    private static readonly prefix: RegExp = /^\s*([+\-*])\s*/

    static isMatch(line: string): boolean {
        return line.match(UnorderedList.prefix) != null
    }

    toHtml(): string {
        return this.toTag(
            'ul',
            this.lines
                .map(this.fixAnchor)
                .map(this.liMaker(UnorderedList.prefix))
                .join('')
        )
    }
}

export class OrderedList extends Markdown {
    private static readonly prefix: RegExp = /^\s*\d\.\s*/

    static isMatch(line: string): boolean {
        return line.match(OrderedList.prefix) != null
    }

    toHtml(): string {
        return this.toTag(
            'ol',
            this.lines
                .map(this.fixAnchor)
                .map(this.liMaker(OrderedList.prefix))
                .join('')
        )
    }
}

export class CodeBlock extends Markdown {
    static isMatch(line: string): boolean {
        return line === '```'
    }

    toHtml(): string {
        return this.lines
            .map(lines => this.toTag('p', lines))
            .join('')
    }
}

export class Prime extends Markdown {
    toHtml(): string {
        return this.lines
            .map(this.fixAnchor)
            .map(line => this.toTag('p', line))
            .join('')
    }
}
