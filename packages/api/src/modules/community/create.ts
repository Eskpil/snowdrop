import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Community } from "../../entities/community/community";
import { Member } from "../../entities/community/member";
import { CommunityInput, CommunityResponse } from "../../graphql/community";
import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../../types";

@Resolver()
export class CommunityCreateResolver {
    @UseMiddleware(isAuth)
    @Mutation(() => CommunityResponse)
    async createCommunity(
        @Arg("options") options: CommunityInput,
        @Ctx() { payload: { user } }: MyContext
    ) {
        let community;

        try {
            const raw = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Community)
                .values({
                    name: options.name,
                    ownerId: user,
                })
                .returning("*")
                .execute();

            community = raw.generatedMaps[0];
        } catch (err) {
            console.log(err);
        }

        if (!community) {
            return {
                errors: [
                    {
                        path: "community",
                        message: "community is undefined please try again",
                    },
                ],
            };
        }

        try {
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Member)
                .values({
                    userId: user,
                    communityId: community?.id,
                    admin: true,
                })
                .returning("*")
                .execute();
        } catch (err) {
            console.log(err);
        }

        return { community };
    }
}
