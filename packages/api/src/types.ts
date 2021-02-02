import { Request, Response } from "express";
import { ExecutionParams } from "subscriptions-transport-ws";
import { CommunityLoader } from "./loader/communityLoader";

export type MyContext = {
    req: Request;
    res: Response;
    connection: ExecutionParams<any>;
    payload: { user: string };
    communityLoader: ReturnType<typeof CommunityLoader>;
};
