import * as borsh from "borsh";


export class FavAccount {
    name: string;
    color: string;
    number: number

    constructor({name, color, number}: {name: string, color: string ,number: number}){
        this.name = name;
        this.color = color;
        this.number = number;
    }
}


export const favSchema = {struct: {
    name: 'string',
    color: 'string',
    number: 'u32',
}};

export const FAV_GREETING_SIZE = borsh.serialize(
    favSchema,
    new FavAccount({name:"", color:"", number: 0})
).length