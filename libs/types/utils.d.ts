/**
 * Recursive partials are partials where every object within it is also a partial.
 */
export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};
