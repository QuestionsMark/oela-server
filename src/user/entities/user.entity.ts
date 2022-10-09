import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true,
        length: 255,
    })
    email: string;

    @Column({
        unique: true,
        length: 100,
    })
    login: string;

    @Column()
    passwordHash: string;

    @Column({
        nullable: true,
        default: null,
    })
    currentTokenId: string | null;
}
