import { Product } from "../../product/entities/product.entity";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';

@Entity()
export class Hashtag extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true,
        length: 100,
    })
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToMany(() => Product, e => e.hashtags)
    @JoinTable()
    products: Product[];
}
