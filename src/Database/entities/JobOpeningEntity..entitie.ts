import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('m_job_openings')
  export class JobOpeningEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column({ type: 'varchar', length: 50 })
    title!: string;
  
    @Column({ type: 'varchar', length: 255 })
    description!: string;
  
    @Column({ type: 'varchar', length: 50 })
    department!: string;
  
    @Column({ type: 'varchar', length: 50 })
    location!: string;
  
    @Column({ type: 'date' })
    openDate!: Date;
  
    @Column({ type: 'date' })
    closeDate!: Date;
  
    @CreateDateColumn()
    create_ts!: Date;
  
    @UpdateDateColumn()
    update_ts!: Date;

    @Column({ type: "uuid" })
    created_by!: string;
  
    @Column({ type: "uuid" })
    updated_by!: string;
  }
  