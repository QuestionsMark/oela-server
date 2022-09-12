import { Product } from "../../product/entities/product.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductType extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true,
        length: 100,
    })
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Product, e => e.productType)
    products: Product[];
}
