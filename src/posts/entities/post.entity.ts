import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 50 })
    title!: string;

    @Column({ type: 'text' })
    content!: string;


    @ManyToOne(() => User, (user) => user.posts)
    authorName!: User;


    @CreateDateColumn()
    createdDate!: Date;

    @UpdateDateColumn()
    updatedDate!: Date;
}