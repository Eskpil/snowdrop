import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Invite } from "../../entities/community/invite";
import { Member } from "../../entities/community/member";
import { CommunityResponse } from "../../graphql/community";
import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../../types";

@Resolver()
export class JoinCommunityResolver {
    @UseMiddleware(isAuth)
    @Mutation(() => CommunityResponse)
    async joinCommunity(
        @Arg("code") code: string,
        @Ctx() { payload: { user } }: MyContext
    ) {
        const invite = await Invite.findOne({
            where: { code },
            relations: ["community"],
        });

        if (!invite) {
            return {
                errors: [
                    {
                        path: "join",
                        message: "invalid code",
                    },
                ],
            };
        }

        const member = await Member.findOne({ where: { userId: user } });

        if (member) {
            return {
                errors: [
                    {
                        path: "join",
                        message: "You have already joined this community",
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
                    communityId: invite.communityId,
                })
                .execute();
        } catch (err) {
            console.log(err);
            return {
                errors: [
                    {
                        path: "join",
                        message: "something went wrong, please try again",
                    },
                ],
            };
        }

        const community = invite.community;

        return { community };
    }
}
