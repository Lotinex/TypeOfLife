type Point = {
    x: number,
    y: number
}
// to get height of initial world.. (consider other way to calculate it)
type IntersectionFromUnion<U> = 
    (U extends any ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never

type OverloadedFromUnion<U> = IntersectionFromUnion<
    U extends any ? (f: U) => void : never
>
type PopUnion<U> = OverloadedFromUnion<U> extends (a: infer A) => void ? A : never

type IsUnion<T> = [T] extends [IntersectionFromUnion<T>] ? false : true

type TupledUnion<T, A extends unknown[] = []> = 
    IsUnion<T> extends true
        ? TupledUnion<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
    : [T, ...A]
// from outer

type Length<T extends Array<any>> = T['length']
type Equals<T, U> = [ T ] extends [ U ] ? [ U ] extends [ T ] ? true : false : false

type Modify<T, K extends PropertyKey, V> = {
    [_K in keyof T]: _K extends K ? V : T[_K]
};

type Prettify<T> = {
    [key in keyof T]: T[key]
}

type ReplaceIndex<S extends string, I extends number, R extends string, _C extends Array<never> = []> = 
    S extends ''
        ? S
        : Equals<Length<_C>, I> extends true
            ? S extends `${infer Front}${infer Back}` 
                ? `${R}${Back}` 
                : never 
            : S extends `${infer Front}${infer Back}` 
                ? `${Front}${ReplaceIndex<Back, I, R, [..._C, never]>}` 
                : never;

type StringLength<S extends string, I extends Array<never> = []> = 
    S extends `` ? Length<I> : S extends `${infer F}${infer Rest}` ? StringLength<Rest, [...I, never]> : never

type Tuple<T, N extends number, _A extends Array<T> = []> =
    Equals<N, Length<_A>> extends true ? _A : Tuple<T, N, [..._A, T]>
type Nth<T extends string, N extends number, C extends Array<never> = []> =
    Equals<Length<C>, N> extends true ? T extends `${infer F}${infer Rest}` ? F : never : T extends `${infer F}${infer Rest}` ? Nth<Rest, N, [...C, never]> : never

type Shifted<T extends Array<any>> = T extends [infer F, ...infer Rest] ? Rest : never
type Pushed<T extends Array<any>, U> = [...T, U]

// ? C : [] should not happen
type ShouldBeArray<T> = T extends [...infer C] ? C : []
type NeverPushed<T extends Array<any>> = ShouldBeArray<[...T, never]>

type IsLessThan2<T extends Array<never> = []> = 
    T extends [never] ? true : T extends [] ? true : false

type Is2Or3<T extends Array<never> = []> = 
    T extends [never, never] ? true : T extends [never, never, never] ? true : false
type IsGreaterThanOr3<T extends Array<never> = []> = 
    T extends [never, never, never, ...infer Rest]  ? true : false
type Is3<T extends Array<never> = []> = 
    T extends [never, never, never] ? true : false

enum CellNextState {
    Alive,
    Dead
}
// :R should not happen
type AliveNeighbourCount<
    Canvas extends Record<number, string>, 
    Cell extends Point, 
    CellMeta extends {x: Array<never>, y: Array<never>} = {
        x: Tuple<never, Cell["x"]>,
        y: Tuple<never, Cell["y"]>
    }, 
    R extends Array<never> = [],  
    Count extends Array<never> = []
> =
    Equals<Length<Count>, 8> extends true ? R : AliveNeighbourCount<
        Canvas, 
        Cell, 
        CellMeta,
        Equals<Length<Count>, 0> extends true 
            ? Equals<Nth<Canvas[Cell["y"]], Length<NeverPushed<CellMeta["x"]>>>, "■"> extends true ? [...R, never] : R
        : Equals<Length<Count>, 1> extends true 
            ? Equals<Nth<Canvas[Length<Shifted<CellMeta["y"]>>], Cell["x"]>, "■"> extends true ? [...R, never] : R
        : Equals<Length<Count>, 2> extends true 
            ? Equals<Nth<Canvas[Cell["y"]], Length<Shifted<CellMeta["x"]>>>, "■"> extends true ? [...R, never] : R
        : Equals<Length<Count>, 3> extends true 
            ? Equals<Nth<Canvas[Length<NeverPushed<CellMeta["y"]>>], Cell["x"]>, "■"> extends true ? [...R, never] : R
        : Equals<Length<Count>, 4> extends true 
            ? Equals<Nth<Canvas[Length<Shifted<CellMeta["y"]>>], Length<NeverPushed<CellMeta["x"]>>>, "■"> extends true ? [...R, never] : R
        : Equals<Length<Count>, 5> extends true 
            ? Equals<Nth<Canvas[Length<Shifted<CellMeta["y"]>>], Length<Shifted<CellMeta["x"]>>>, "■"> extends true ? [...R, never] : R
        : Equals<Length<Count>, 6> extends true 
            ? Equals<Nth<Canvas[Length<NeverPushed<CellMeta["y"]>>], Length<Shifted<CellMeta["x"]>>>, "■"> extends true ? [...R, never] : R
        : Equals<Length<Count>, 7> extends true 
            ?  Equals<Nth<Canvas[Length<NeverPushed<CellMeta["y"]>>], Length<NeverPushed<CellMeta["x"]>>>, "■"> extends true ? [...R, never] : R
        : R,
        [...Count, never]
    >
type CheckCell<
    Canvas extends Record<number, string>, 
    Cell extends Point, 
    CountTuple extends Array<never> = AliveNeighbourCount<Canvas, Cell>
> = 
    Equals<Nth<Canvas[Cell["y"]], Cell["x"]>, " "> extends true 
        ?  Is3<CountTuple> extends true 
            ? CellNextState.Alive 
            : CellNextState.Dead 
    : Is2Or3<CountTuple> extends true 
        ? CellNextState.Alive 
        : CellNextState.Dead

type UpdateRow<
    Canvas extends Record<number, string>, 
    Y extends number, 
    Row extends string = Canvas[Y], 
    L extends number = StringLength<Row>, 
    Counter extends Array<never> = []
> = 
    Equals<Length<Counter>, L> extends true 
    ? Row 
    : UpdateRow<
        Canvas,
        Y,
        ReplaceIndex<
            Row, Length<Counter>, 
            Equals<
                CheckCell<Canvas, {x: Length<Counter>, y: Y}>, 
                CellNextState.Alive
            > extends true 
                ? "■" 
                : " "
        >,
        L,
        [...Counter, never]
    >
type Update<
    Canvas extends Record<number, string>, 
    Counter extends Array<never> = [], 
    R extends Record<number, string> = Canvas
> =
    Equals<Length<Counter>, Length<TupledUnion<keyof Canvas>>> extends true 
    ? R 
    : Update<
        Canvas,
        [...Counter, never],
        Modify<R, Length<Counter>, UpdateRow<Canvas, Length<Counter>>>
    >
/**
 * Usage: GameOfLife<InitialMap, Tick>
 */
type GameOfLife<
    Canvas extends Record<number, string>, 
    Tick extends number, 
    Counter extends Array<never> = []
> =
    Equals<Length<Counter>, Tick> extends true 
    ? Prettify<Canvas> 
    : GameOfLife<
        //@ts-ignore <- required because typescript server doesn't like too complexed type such as Update<Canvas>
        Update<Canvas>,
        Tick,
        [...Counter, never]
    >




type Game = GameOfLife<{
    6: "              ■    ",
    5: "                   ",
    4: "        ■          ",
    3: "       ■■■         ",
    2: "        ■      ■   ",
    1: "               ■   ",
    0: "               ■   ",
}, 1>
