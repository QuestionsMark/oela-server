import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../product/entities/product.entity";
import { Collection } from "src/collection/entities/collection.entity";
import { News } from "src/news/entities/news.entity";
import { Cover } from "src/cover/entities/cover.entity";

@Entity()
export class FileItem extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true,
    })
    filename: string;

    @ManyToOne(() => Product, e => e.images)
    product: Product;

    @ManyToOne(() => Collection, e => e.images)
    collection: Collection;

    @OneToOne(() => News, e => e.image)
    @JoinColumn()
    news: News;

    @OneToOne(() => Cover, e => e.image)
    @JoinColumn()
    cover: Cover;
}