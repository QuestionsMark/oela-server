import { FileItem } from '../../file/file.entity';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity()
export class News extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true,
        length: 200,
    })
    name: string;

    @Column({
        length: 1000,
    })
    description: string;

    @Column({
        type: 'date',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @OneToOne(() => FileItem, e => e.news)
    image: FileItem;
}
