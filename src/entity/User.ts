import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { FavouritePlace } from "./FavouritePlace";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @OneToMany(() => FavouritePlace, (favouritePlace) => favouritePlace.user)
  favouritePlaces!: FavouritePlace[];
}
