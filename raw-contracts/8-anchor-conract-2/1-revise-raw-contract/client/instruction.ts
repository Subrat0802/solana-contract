import * as borsh from "borsh";

export class CounterProgram {
    count = 0;

    constructor({count}: {count: number}){
        this.count = count;
    }
}

export const schema = {struct: {count: 'u32'}};
export const GREETING_SIZE = borsh.serialize(
    schema,
    new CounterProgram({count: 0})
).length;