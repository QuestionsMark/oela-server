import { FileItem } from "src/file/file.entity";
import { Product } from "src/product/entities/product.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Collection extends BaseEntity {
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
    
    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => FileItem, e => e.collection)
    images: FileItem[];

    @OneToMany(() => Product, e => e.collection)
    products: Product[];
}
