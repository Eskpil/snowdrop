import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "../../entities/user";
import { AuthInput, AuthResponse } from "../../graphql/auth";
import argon2 from "argon2";
import { createAccessToken, createRefreshToken } from "../../utils/auth";
import { COOKIE_NAME } from "../../constants";
import { MyContext } from "../../types";

@Resolver()
export class LoginResovler {
    @Mutation(() => AuthResponse)
    async login(@Arg("options") options: AuthInput, @Ctx() { res }: MyContext) {
        const user = await User.findOne({ email: options.email });

        if (!user) {
            return {
                errors: [
                    {
                        path: "email",
                        message: "invalid email",
                    },
                ],
            };
        }

        const verify = await argon2.verify(user.password, options.password);
        if (!verify) {
            return {
                errors: [
                    {
                        path: "password",
                        message: "invalid password",
                    },
                ],
            };
        }

        res.cookie(COOKIE_NAME, createRefreshToken(user), {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: "lax",
            path: "/graphql",
        });

        return { user, accessToken: createAccessToken(user) };
    }
}
