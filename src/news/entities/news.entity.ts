import { FileItem } from '../../file/file.entity';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';

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

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => FileItem, e => e.news)
    images: FileItem[];
}
