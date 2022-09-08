import { Product } from "../../product/entities/product.entity";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Hashtag extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 100,
    })
    name: string;

    @Column({
        type: 'date',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @ManyToMany(() => Product, e => e.hashtags)
    @JoinTable()
    products: Product[];
}
