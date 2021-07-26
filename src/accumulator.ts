import {Match} from "./match";
import {CodeBlock, Markdown, OrderedList, Prime, UnorderedList} from "./markdown";

type Type = 'init' | 'unordered list' | 'ordered list' | 'code block' | 'prime'

class Accumulator {
    private last: Type = 'init'
    private codeOpened: boolean = false
    private chunks: Array<string[]> = []

    push(line: string): Accumulator {
        const current = this.current(line)

        if (this.last === current) {
            this.chunks[this.chunks.length - 1].push(line)
        } else {
            this.chunks.push([line])
        }

        this.last = current

        return this
    }

    private current(line: string): Type {
        if (this.codeOpened) {
            if (CodeBlock.isMatch(line)) {
                this.codeOpened = false
            }
            return 'code block'
        }
        //@formatter:off
        return new Match<string, Type>(line)
            .case(UnorderedList.isMatch, () => 'unordered list')
            .case(OrderedList.isMatch,   () => 'ordered list')
            .case(CodeBlock.isMatch,     () => { this.codeOpened = true; return 'code block' })
            .otherwise(                  () => 'prime')
        //@formatter:on
    }

    markdowns(): Markdown[] {
        //@formatter:off
        return this.chunks.map(
            chunk => new Match<string, Markdown>(chunk[0])
                .case(UnorderedList.isMatch, () => new UnorderedList(chunk))
                .case(OrderedList.isMatch,   () => new OrderedList(chunk))
                .case(CodeBlock.isMatch,     () => new CodeBlock(chunk))
                .otherwise(                  () => new Prime(chunk))
        )
        //@formatter:on
    }
}

export function apply(editing: string): string {
    return editing
        .replace(/^(<p><br><\/p>)*/, '').replace(/(<p><br><\/p>)*$/, '')
        .replace(/<p>/g, '').replace(/<\/p>/g, '\n')
        .trim().split('\n')
        .reduce((acc, line) => acc.push(line), new Accumulator())
        .markdowns()
        .map(m => m.toHtml())
        .join('')
}
