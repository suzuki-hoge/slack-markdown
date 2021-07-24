interface ChainableFor<T, V, R> {
    case(condition: (t: T) => boolean, runnable: (v: V) => R): ChainableFor<T, V, R>

    otherwise(runnable: (v: V) => R): R
}

export class MatchFor<T, V, R> implements ChainableFor<T, V, R> {
    private readonly t: T
    private readonly v: V

    constructor(t: T, v: V) {
        this.t = t;
        this.v = v;
    }

    case(condition: (t: T) => boolean, runnable: (v: V) => R): ChainableFor<T, V, R> {
        return condition(this.t) ? new ClosedFor(runnable(this.v)) : new MatchFor(this.t,this.v)
    }

    otherwise(runnable: (v: V) => R): R {
        return runnable(this.v)
    }
}

class ClosedFor<T, V, R> implements ChainableFor<T, V, R> {
    private readonly r: R

    constructor(r: R) {
        this.r = r;
    }

    case(condition: (t: T) => boolean, runnable: (v: V) => R): ChainableFor<T, V, R> {
        return this
    }

    otherwise(runnable: (v: V) => R): R {
        return this.r
    }
}
