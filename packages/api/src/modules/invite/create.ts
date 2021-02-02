import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Community } from "../../entities/community/community";
import { Invite } from "../../entities/community/invite";
import { InviteInput, InviteResponse } from "../../graphql/invite";
import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../../types";
import { nanoid } from "nanoid";

@Resolver()
export class CreateInviteResolver {
    @UseMiddleware(isAuth)
    @Mutation(() => InviteResponse)
    async createInvite(
        @Arg("options") options: InviteInput,
        @Ctx() { payload: { user } }: MyContext
    ) {
        const community = await Community.findOne({
            where: { id: options.community },
        });

        if (!community) {
            return {
                errors: [
                    {
                        path: "invite",
                        message:
                            "you cannot create invites for a nonexistent community",
                    },
                ],
            };
        }

        if (community?.ownerId !== user) {
            return {
                errors: [
                    {
                        path: "invite",
                        message:
                            "you must be community owner to create invites",
                    },
                ],
            };
        }

        const rawinvite = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Invite)
            .values({
                communityId: community.id,
                code: nanoid(5),
            })
            .returning("*")
            .execute();
        const invite = rawinvite.generatedMaps[0];
        return { invite };
    }
}
