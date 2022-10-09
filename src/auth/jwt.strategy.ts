import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-jwt';
import { SECRET_KEY } from "../config/config";
import { JwtPayload } from "../types";
import { User } from "../user/entities/user.entity";

const cookieExtractor = (req: any): null | string => {
    return (req && req.cookies) ? (req.cookies?.jwt ?? null) : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: cookieExtractor,
            secretOrKey: SECRET_KEY,
        })
    }

    async validate(payload: JwtPayload, done: (err: UnauthorizedException, user: User | null) => void) {
        if (!payload || !payload.id) {
            return done(new UnauthorizedException(), null);
        }
        const user = await User.findOne({
            where: {
                currentTokenId: payload.id,
            },
        });
        if (!user) {
            return done(new UnauthorizedException(), null);
        }
        done(null, user);
    }
}