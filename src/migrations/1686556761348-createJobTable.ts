import { MigrationInterface, QueryRunner } from 'typeorm';

export class creatJobTable1686556761348 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE TABLE job
        (
          id INT NOT NULL AUTO_INCREMENT, 
          name varchar(255) NOT NULL, 
          parent_id INT NULL, 
          created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
          updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
          deleted_at DATETIME(6) NULL, 
          PRIMARY KEY (id),
          CONSTRAINT fk_parent
          FOREIGN KEY (parent_id) REFERENCES job(id)
        );
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE user_job
        (
          id INT NOT NULL AUTO_INCREMENT, 
          user_id INT NOT NULL,
          job_id INT NOT NULL,
          created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
          updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
          deleted_at DATETIME(6) NULL, 
          PRIMARY KEY (id),
          CONSTRAINT fk_user
          FOREIGN KEY (user_id) REFERENCES user(id),
          CONSTRAINT fk_job
          FOREIGN KEY (job_id) REFERENCES job(id)
        );
      `,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
