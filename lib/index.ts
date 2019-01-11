import { Constructable, JsonMapper } from 'at-json';
import { iif, Observable, of, OperatorFunction } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';


export function mapJsonModel<T, U>(ctor: Constructable<U>): OperatorFunction<T, U> {
    return (source: Observable<T>) => {
        return source.pipe(
            map(v => JsonMapper.deserialize(ctor, v || {}))
        );
    };
}

export function mapJsonArray<T, U>(ctor: Constructable<U>): OperatorFunction<T[] | null, U[]> {
    return (source: Observable<T[]>) => {
        return source.pipe(
            map(v => JsonMapper.deserializeArray(ctor, v || []))
        );
    };
}

export function conditionaMapJsonModel<T, T2, U>(predicate: (value: T) => boolean, ctor: Constructable<U>, selector: (value: T) => T2, defaultValue: U): OperatorFunction<T, U> {
    return (source: Observable<T>) => {
        return source.pipe(
            mergeMap(value => {
                return iif(
                    () => predicate(value),
                    of(selector(value)).pipe(mapJsonModel(ctor)),
                    of(defaultValue)
                );
            })
        );
    };
}

export function conditionaMapJsonArray<T, T2, U>(predicate: (value: T[]) => boolean, ctor: Constructable<U>, selector: (value: T) => T2, defaultNull = false): OperatorFunction<T[] | null, U[]> {
    return (source: Observable<T[]>) => {
        return source.pipe(
            mergeMap(value => {
                return iif(
                    () => predicate(value),
                    of(value.map(selector)).pipe(mapJsonArray(ctor)),
                    of(defaultNull ? null : [])
                );
            })
        );
    };
}
