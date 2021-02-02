import { User } from "../entities/user";
import { sign } from "jsonwebtoken";

export const createAccessToken = (user: User) => {
    return sign({ user: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "150m",
    });
};

export const createRefreshToken = (user: User) => {
    return sign(
        { user: user.id, tokenVersion: user.tokenVersion },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: "7d",
        }
    );
};
