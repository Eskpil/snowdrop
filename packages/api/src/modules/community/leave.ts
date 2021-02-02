import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Member } from "../../entities/community/member";
import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../../types";

@Resolver()
export class LeaveCommunityResolver {
    @UseMiddleware(isAuth)
    @Mutation(() => Boolean)
    async leaveCommunity(
        @Arg("community") id: string,
        @Ctx() { payload: { user } }: MyContext
    ) {
        const raw = await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Member)
            .where("userId = :user AND communityId = :id", { user, id })
            .execute();

        if (raw.affected == 0) {
            return false;
        }

        return true;
    }
}
