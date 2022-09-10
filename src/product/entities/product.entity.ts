import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany } from 'typeorm';
import { FileItem } from '../../file/file.entity';
import { ProductType } from '../../product-type/entities/product-type.entity';
import { Hashtag } from '../../hashtag/entities/hashtag.entity';
import { Specification } from './specification.entity';
import { Collection } from '../../collection/entities/collection.entity';

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true,
        length: 100,
    })
    name: string;

    @Column({
        length: 1000,
    })
    description: string;

    @Column({
        length: 255,
    })
    shopLink: string;

    @Column({
        type: 'date',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
    
    @OneToMany(() => FileItem, e => e.product)
    images: FileItem[];

    @ManyToMany(() => Hashtag, e => e.products)
    hashtags: Hashtag[];

    @ManyToOne(() => ProductType, e => e.products)
    productType: ProductType;

    @OneToMany(() => Specification, e => e.product)
    specifications: Specification[];

    @ManyToOne(() => Collection, e => e.products)
    collection: Collection;
}