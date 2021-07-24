import {Line} from './line'
import {Match} from "./match";
import {MatchFor} from "./match-for";

export class Blocks {
    private readonly blocks: Block[] = []
    private continuous: MultiLineBlock | null = null

    pushMarkdown(markdown: string): Blocks {
        // @formatter:off
        new MatchFor(this.continuous, markdown)
            .case(
                c => c == null, () => new Match(markdown)
                    .case(OrderedList.isApplicable,   this.start(OrderedList))
                    .case(UnorderedList.isApplicable, this.start(UnorderedList))
                    .case(CodeBlock.isApplicable,     this.start(CodeBlock))
                    .case(Quote.isApplicable,         this.fix(Quote))
                    .otherwise(                       this.fix(Paragraph))
            )
            .case(
                c => c instanceof OrderedList, () => new Match(markdown)
                    .case(OrderedList.isApplicable,   this.continue())
                    .case(UnorderedList.isApplicable, this.switchStart(UnorderedList))
                    .case(CodeBlock.isApplicable,     this.switchStart(CodeBlock))
                    .case(Quote.isApplicable,         this.switchFix(Quote))
                    .otherwise(                       this.switchFix(Paragraph))
            )
            .case(
                c => c instanceof UnorderedList, () => new Match(markdown)
                    .case(OrderedList.isApplicable,   this.switchStart(OrderedList))
                    .case(UnorderedList.isApplicable, this.continue())
                    .case(CodeBlock.isApplicable,     this.switchStart(CodeBlock))
                    .case(Quote.isApplicable,         this.switchFix(Quote))
                    .otherwise(                       this.switchFix(Paragraph))
            )
            .case(
                c => c instanceof CodeBlock, () => new Match(markdown)
                    .case(CodeBlock.isApplicable,     this.end())
                    .otherwise(                       this.continue())
            )
        // @formatter:on

        return this
    }

    private start(constructor: new(markdown: string) => MultiLineBlock): (markdown: string) => void {
        return markdown => this.continuous = new constructor(markdown)
    }

    private fix(constructor: new(markdown: string) => SingleLineBlock): (markdown: string) => void {
        return markdown => this.blocks.push(new constructor(markdown))
    }

    private continue(): (markdown: string) => void {
        return markdown => this.continuous?.pushMarkdown(markdown)
    }

    private end(): (markdown: string) => void {
        return markdown => {
            if (this.continuous != null) {
                this.continuous.pushMarkdown(markdown)
                this.blocks.push(this.continuous)
                this.continuous = null
            }
        }
    }

    private switchStart(constructor: new(markdown: string) => MultiLineBlock): (markdown: string) => void {
        return markdown => {
            if (this.continuous != null) {
                this.blocks.push(this.continuous)
                this.continuous = new constructor(markdown)
            }
        }
    }

    private switchFix(constructor: new(char: string) => SingleLineBlock): (char: string) => void {
        return markdown => {
            if (this.continuous != null) {
                this.blocks.push(this.continuous)
                this.continuous = null
                this.blocks.push(new constructor(markdown))
            }
        }
    }

    finish(): Blocks {
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
    protected readonly markdown: string

    constructor(markdown: string) {
        super()
        this.markdown = markdown
    }
}

abstract class MultiLineBlock extends Block {
    protected readonly markdowns: string[]

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
    private static readonly prefix: string = '&gt; '

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
    private static readonly prefix: RegExp = /^\s*\d\.\s*/

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
    private static readonly prefix: RegExp = /^\s*([+\-])\s*/

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
