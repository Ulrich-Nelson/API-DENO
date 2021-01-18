import { userRoleType } from "./roleTypes.ts";

export type jwtPayload = {
    iss: string,
    id: string,
    email: string,
    roles: userRoleType,
    exp: number
} 