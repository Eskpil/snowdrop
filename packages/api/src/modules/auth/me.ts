import { verify } from "jsonwebtoken";
import { Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Community } from "../../entities/community/community";
import { Member } from "../../entities/community/member";
import { User } from "../../entities/user";
import { MyContext } from "../../types";

@Resolver(User)
export class MeResolver {
    @FieldResolver(() => [Member], { nullable: true })
    async communities(@Ctx() { req }: MyContext) {
        const token = req.headers["authorization"]?.split(" ")[1];

        let payload: any = verify(token!, process.env.ACCESS_TOKEN_SECRET!);

        return Member.find({
            where: { userId: payload.user },
            relations: ["community"],
        });
    }

    @Query(() => User, { nullable: true })
    async me(@Ctx() { req, payload: myPayload }: MyContext) {
        const token = req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            throw new Error("no token");
        }

        try {
            let payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
            myPayload = payload;

            return User.findOne({ where: { id: payload.user } });
        } catch (err) {
            throw new Error(err);
        }
    }
}

// @Resolver(Member)
// export class MeMemberResolver {
//     @FieldResolver(() => [Community], { nullable: true })
//     async guild(@Root() member: Member, @Ctx() { communityLoader }: MyContext) {
//         console.log("Field Resolver", member);

//         const loaded = communityLoader.load(member.communityId);

//         console.log("Loaded", loaded);

//         return loaded;
//     }
// }
