export type SerializeDates<T> = T extends Date
  ? // Typescript utility to serialize all dates in interface to strings, vital for
    // correct RPC typing (hono/client + https://github.com/kalutskii/contract)
    string
  : T extends (infer U)[] // Arrays
    ? SerializeDates<U>[]
    : T extends readonly (infer U)[]
      ? readonly SerializeDates<U>[]
      : T extends object // Object
        ? { [K in keyof T]: SerializeDates<T[K]> }
        : T;
