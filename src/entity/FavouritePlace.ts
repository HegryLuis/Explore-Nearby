import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class FavouritePlace {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  placeId!: string;

  @Column()
  placeName!: string;

  @ManyToOne(() => User, (user) => user.favouritePlaces)
  user!: User;
}
