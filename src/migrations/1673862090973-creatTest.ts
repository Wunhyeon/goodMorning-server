import { MigrationInterface, QueryRunner } from 'typeorm';

export class creatTest1673862090973 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE TABLE test(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        is_img BOOLEAN DEFAULT TRUE,
        popup_img_key VARCHAR(1000) NULL,
        popup_img_url VARCHAR(1000) NULL,
        popup_url VARCHAR(1000) NULL,
        script TEXT NULL,
        description TEXT NULL,
        start_date DATETIME NULL,
        end_date DATETIME NULL,
        idx INT UNSIGNED NULL, 
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        deleted_at DATETIME(6) NULL
        );
      `,
    );

    await queryRunner.query(
      `
      DROP TABLE test;
      `,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
