import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class Url {
  constructor(shortHash: string, originalUrl: string) {
    this.shortHash = shortHash
    this.originalUrl = originalUrl
  }

  @PrimaryColumn('varchar', { nullable: false })
  public shortHash: string

  @Column('text', { nullable: false })
  public originalUrl: string
}
