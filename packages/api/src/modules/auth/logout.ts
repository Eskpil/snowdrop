import { Ctx, Mutation, Resolver } from "type-graphql";
import { COOKIE_NAME } from "../../constants";
import { MyContext } from "../../types";

@Resolver()
export class LogoutResolver {
    @Mutation(() => Boolean)
    async logout(@Ctx() { res }: MyContext) {
        res.cookie(COOKIE_NAME, "", {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
        });
        return true;
    }
}
