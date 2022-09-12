import { FileItem } from "../../file/file.entity";
import { BaseEntity, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cover extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => FileItem)
    @JoinColumn()
    image: FileItem;
}
