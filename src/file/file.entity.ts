import { BaseEntity, Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @Column({
        nullable: true,
        length: 255,
        default: null,
    })
    alt: string | null;

    @ManyToOne(() => Product, e => e.images)
    product: Product;

    @ManyToOne(() => Collection, e => e.images)
    collection: Collection;

    @ManyToOne(() => News, e => e.images)
    news: News;

    @OneToOne(() => Cover)
    cover: Cover;
}