interface Chainable<T, R> {
    case(condition: (t: T) => boolean, runnable: (t:T) => R): Chainable<T, R>

    otherwise(runnable: (t: T) => R): R
}

export class Match<T, R> implements Chainable<T, R> {
    private readonly t: T

    constructor(t: T) {
        this.t = t;
    }

    case(condition: (t: T) => boolean, runnable: (t:T) => R): Chainable<T, R> {
        return condition(this.t) ? new Closed(runnable(this.t)) : new Match(this.t)
    }

    otherwise(runnable: (t: T) => R): R {
        return runnable(this.t)
    }
}

class Closed<T, R> implements Chainable<T, R> {
    private readonly r: R

    constructor(r: R) {
        this.r = r;
    }

    case(condition: (t: T) => boolean, runnable: (t:T) => R): Chainable<T, R> {
        return this
    }

    otherwise(runnable: (t: T) => R): R {
        return this.r
    }
}
