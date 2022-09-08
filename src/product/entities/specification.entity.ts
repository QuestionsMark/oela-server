import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Specification extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 100,
    })
    name: string;

    @Column({
        length: 100,
    })
    value: string;

    @ManyToOne(() => Product, e => e.specifications)
    product: Product;
}