import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { AuthResponse, AuthInput } from "../../graphql/auth";
import { validateRegister } from "../../utils/validateRegister";
import argon2 from "argon2";
import { User } from "../../entities/user";
import { COOKIE_NAME } from "../../constants";
import { createAccessToken, createRefreshToken } from "../../utils/auth";
import { MyContext } from "../../types";

@Resolver()
export class RegisterResolver {
    @Mutation(() => AuthResponse)
    async register(
        @Arg("options") options: AuthInput,
        @Ctx() { res }: MyContext
    ) {
        const errors = validateRegister(options);
        if (errors) {
            return { errors };
        }
        const password = await argon2.hash(options.password);
        let user;
        try {
            const { email, username } = options;
            const raw = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    username,
                    email,
                    password,
                })
                .returning("*")
                .execute();
            user = raw.raw[0];
        } catch (err) {
            if (err.code === "23505") {
                return {
                    errors: [
                        {
                            path: "register",
                            message: "email already in use",
                        },
                    ],
                };
            }
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
