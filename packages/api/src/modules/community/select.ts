import {
    Arg,
    Ctx,
    FieldResolver,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from "type-graphql";
import { Community } from "../../entities/community/community";
import { Member } from "../../entities/community/member";
import { CommunityResponse } from "../../graphql/community";
import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../../types";

@Resolver(Community)
export class SelectCommunityResolver {
    @FieldResolver(() => [Member])
    members(@Root() community: Community) {
        return Member.find({
            where: { communityId: community.id },
            relations: ["user"],
        });
    }

    @UseMiddleware(isAuth)
    @Query(() => CommunityResponse)
    async selectCommunity(@Arg("community") id: string) {
        const community = await Community.findOne({ where: { id } });

        if (!community) {
            return {
                errors: [
                    {
                        path: "select",
                        message: "community does not exist",
                    },
                ],
            };
        }

        return { community };
    }
}
