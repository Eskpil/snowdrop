import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Community } from "../../entities/community/community";
import { Member } from "../../entities/community/member";
import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../../types";

@Resolver()
export class DeleteCommunityResolver {
    @UseMiddleware(isAuth)
    @Mutation(() => Boolean)
    async deleteCommunity(
        @Arg("community") id: string,
        @Ctx() { payload }: MyContext
    ) {
        const community = await Community.findOne({ where: { id } });

        console.log(community);

        if (!community) {
            throw new Error("That community does not exist");
        }

        if (community?.ownerId !== payload.user) {
            throw new Error("You can only delete your own community");
        }

        await Member.delete({ communityId: community.id });
        await Community.delete(community);

        return true;
    }
}
