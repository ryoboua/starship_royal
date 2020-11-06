declare const _exports: {
    [n: number]: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    };
    length: number;
    toString(): string;
    toLocaleString(): string;
    pop(): {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    } | undefined;
    push(...items: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]): number;
    concat(...items: ConcatArray<{
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }>[]): {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[];
    concat(...items: ({
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    } | ConcatArray<{
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }>)[]): {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[];
    join(separator?: string | undefined): string;
    reverse(): {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[];
    shift(): {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    } | undefined;
    slice(start?: number | undefined, end?: number | undefined): {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[];
    sort(compareFn?: ((a: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, b: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }) => number) | undefined): {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[];
    splice(start: number, deleteCount?: number | undefined): {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[];
    splice(start: number, deleteCount: number, ...items: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]): {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[];
    unshift(...items: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]): number;
    indexOf(searchElement: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, fromIndex?: number | undefined): number;
    lastIndexOf(searchElement: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, fromIndex?: number | undefined): number;
    every<S extends {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }>(predicate: (value: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, index: number, array: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]) => value is S, thisArg?: any): this is S[];
    every(predicate: (value: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, index: number, array: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]) => unknown, thisArg?: any): boolean;
    some(predicate: (value: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, index: number, array: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]) => unknown, thisArg?: any): boolean;
    forEach(callbackfn: (value: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, index: number, array: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]) => void, thisArg?: any): void;
    map<U>(callbackfn: (value: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, index: number, array: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]) => U, thisArg?: any): U[];
    filter<S_1 extends {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }>(predicate: (value: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, index: number, array: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]) => value is S_1, thisArg?: any): S_1[];
    filter(predicate: (value: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, index: number, array: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]) => unknown, thisArg?: any): {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[];
    reduce(callbackfn: (previousValue: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, currentValue: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, currentIndex: number, array: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]) => {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }): {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    };
    reduce(callbackfn: (previousValue: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, currentValue: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, currentIndex: number, array: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]) => {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, initialValue: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }): {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    };
    reduce<U_1>(callbackfn: (previousValue: U_1, currentValue: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, currentIndex: number, array: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]) => U_1, initialValue: U_1): U_1;
    reduceRight(callbackfn: (previousValue: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, currentValue: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, currentIndex: number, array: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]) => {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }): {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    };
    reduceRight(callbackfn: (previousValue: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, currentValue: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, currentIndex: number, array: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]) => {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, initialValue: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }): {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    };
    reduceRight<U_2>(callbackfn: (previousValue: U_2, currentValue: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, currentIndex: number, array: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]) => U_2, initialValue: U_2): U_2;
    find<S_2 extends {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }>(predicate: (this: void, value: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, index: number, obj: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]) => value is S_2, thisArg?: any): S_2 | undefined;
    find(predicate: (value: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, index: number, obj: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]) => unknown, thisArg?: any): {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    } | undefined;
    findIndex(predicate: (value: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, index: number, obj: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]) => unknown, thisArg?: any): number;
    fill(value: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, start?: number | undefined, end?: number | undefined): {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[];
    copyWithin(target: number, start: number, end?: number | undefined): {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[];
    [Symbol.iterator](): IterableIterator<{
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }>;
    entries(): IterableIterator<[number, {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }]>;
    keys(): IterableIterator<number>;
    values(): IterableIterator<{
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }>;
    [Symbol.unscopables](): {
        copyWithin: boolean;
        entries: boolean;
        fill: boolean;
        find: boolean;
        findIndex: boolean;
        keys: boolean;
        values: boolean;
    };
    includes(searchElement: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, fromIndex?: number | undefined): boolean;
    flatMap<U_3, This = undefined>(callback: (this: This, value: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }, index: number, array: {
        number: number;
        numOfAsteroids: number;
        asteroidFieldTimeInterval: number;
    }[]) => U_3 | readonly U_3[], thisArg?: This | undefined): U_3[];
    flat<A, D extends number = 1>(this: A, depth?: D | undefined): FlatArray<A, D>[];
};
export = _exports;
