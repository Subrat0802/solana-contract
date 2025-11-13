import * as borsh from "borsh";
import { favSchema, FavAccount } from "./instrfav";

export function encodeFavourite(name: string, color: string, number: number) {
    const fav = new FavAccount({ name, color, number });
    return Buffer.from(borsh.serialize(favSchema, fav));
}
