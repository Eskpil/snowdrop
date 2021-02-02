import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { MyContext } from "../types";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
    const token = context.req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        throw new Error("not authenticated");
    }

    try {
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        context.payload = payload as any;
    } catch (err) {
        console.log(err);
        throw new Error("not authenticated");
    }

    return next();
};
