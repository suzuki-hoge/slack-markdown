import {Line} from './line'

export class Blocks {
    private blocks: Block[] = []
    private continuous: MultiLineBlock | null = null

    pushMarkdown(markdown: string): Blocks {
        if (this.continuous == null) {
            if (OrderedList.isApplicable(markdown)) {
                this.continuous = new OrderedList(markdown)
            } else if (UnorderedList.isApplicable(markdown)) {
                this.continuous = new UnorderedList(markdown)
            } else if (CodeBlock.isApplicable(markdown)) {
                this.continuous = new CodeBlock(markdown)
            } else if (Quote.isApplicable(markdown)) {
                this.blocks.push(new Quote(markdown))
            } else {
                this.blocks.push(new Paragraph(markdown))
            }
        } else if (this.continuous instanceof OrderedList) {
            if (OrderedList.isApplicable(markdown)) {
                this.continuous.pushMarkdown(markdown)
            } else if (UnorderedList.isApplicable(markdown)) {
                this.blocks.push(this.continuous)
                this.continuous = new UnorderedList(markdown)
            } else if (CodeBlock.isApplicable(markdown)) {
                this.blocks.push(this.continuous)
                this.continuous = new CodeBlock(markdown)
            } else if (Quote.isApplicable(markdown)) {
                this.blocks.push(this.continuous)
                this.continuous = null
                this.blocks.push(new Quote(markdown))
            } else {
                this.blocks.push(this.continuous)
                this.continuous = null
                this.blocks.push(new Paragraph(markdown))
            }
        } else if (this.continuous instanceof UnorderedList) {
            if (OrderedList.isApplicable(markdown)) {
                this.blocks.push(this.continuous)
                this.continuous = new OrderedList(markdown)
            } else if (UnorderedList.isApplicable(markdown)) {
                this.continuous.pushMarkdown(markdown)
            } else if (CodeBlock.isApplicable(markdown)) {
                this.blocks.push(this.continuous)
                this.continuous = new CodeBlock(markdown)
            } else if (Quote.isApplicable(markdown)) {
                this.blocks.push(this.continuous)
                this.continuous = null
                this.blocks.push(new Quote(markdown))
            } else {
                this.blocks.push(this.continuous)
                this.continuous = null
                this.blocks.push(new Paragraph(markdown))
            }
        } else if (this.continuous instanceof CodeBlock) {
            if (CodeBlock.isApplicable(markdown)) {
                this.continuous.pushMarkdown(markdown)
                this.blocks.push(this.continuous)
                this.continuous = null
            } else {
                this.continuous.pushMarkdown(markdown)
            }
        }

        return this
    }

    finish():Blocks {
        if (this.continuous != null) {
            this.blocks.push(this.continuous)
            this.continuous = null
        }
        return this
    }

    toHtml(): string {
        return this.blocks.map(b => b.toHtml()).join('')
    }
}

abstract class Block {
    abstract toHtml(): string

    protected toTag(name: string, content: string, classes?: string): string {
        const attr = classes == null ? '' : ` class="${classes}"`
        return `<${name}${attr}>${content}</${name}>`
    }
}

abstract class SingleLineBlock extends Block {
    protected markdown: string

    constructor(markdown: string) {
        super()
        this.markdown = markdown
    }
}

abstract class MultiLineBlock extends Block {
    protected markdowns: string[]

    constructor(markdown: string) {
        super()
        this.markdowns = [markdown]
    }

    pushMarkdown(markdown: string) {
        this.markdowns.push(markdown)
    }
}

class Paragraph extends SingleLineBlock {
    toHtml(): string {
        return this.toTag(
            'p',
            new Line(this.markdown).toHtml()
        )
    }
}

class Quote extends SingleLineBlock {
    private static prefix: string = '&gt; '

    static isApplicable(line: string): boolean {
        return line.startsWith(Quote.prefix)
    }

    toHtml(): string {
        return this.toTag(
            'blockquote',
            new Line(this.markdown.replace(Quote.prefix, '')).toHtml()
        )
    }
}

class OrderedList extends MultiLineBlock {
    private static prefix: RegExp = /^\s*\d\.\s*/

    static isApplicable(line: string): boolean {
        return line.match(OrderedList.prefix) != null
    }

    toHtml(): string {
        return this.toTag(
            'ol',
            this.markdowns
                .map(
                    markdown => this.toTag(
                        'li',
                        new Line(markdown.replace(OrderedList.prefix, '')).toHtml(),
                        `ql-indent-${(markdown.length - markdown.replace(/\s*/, '').length) / 2}`
                    )
                )
                .join('')
        )
    }
}

class UnorderedList extends MultiLineBlock {
    private static prefix: RegExp = /^\s*([+\-])\s*/

    static isApplicable(line: string): boolean {
        return line.match(UnorderedList.prefix) != null
    }

    toHtml(): string {
        return this.toTag(
            'ul',
            this.markdowns
                .map(
                    markdown => this.toTag(
                        'li',
                        new Line(markdown.replace(UnorderedList.prefix, '')).toHtml(),
                        `ql-indent-${(markdown.length - markdown.replace(/\s*/, '').length) / 2}`
                    )
                )
                .join('')
        )
    }
}

class CodeBlock extends MultiLineBlock {
    static isApplicable(line: string): boolean {
        return line == '```'
    }

    toHtml(): string {
        return this.markdowns
            .filter(markdown => markdown != '```')
            .map(
                markdown => this.toTag('div', markdown, 'ql-code-block')
            )
            .join('')
    }
}
