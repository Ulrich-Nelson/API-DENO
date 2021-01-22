import { userRoleType } from "./userTypes.ts";

export type jwtPayload = {
    iss: string,
    id: string,
    email: string,
    roles: userRoleType,
    exp: number
} 