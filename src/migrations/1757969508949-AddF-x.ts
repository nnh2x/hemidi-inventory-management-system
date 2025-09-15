import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFX1757969508949 implements MigrationInterface {
  name = 'AddFX1757969508949';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NULL ON UPDATE CURRENT_TIMESTAMP, \`is_deleted\` tinyint NOT NULL DEFAULT false, \`name\` varchar(100) NOT NULL, \`description\` text NULL, \`code\` varchar(10) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_77d7eff8a7aaa05457a12b8007\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`warehouses\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NULL ON UPDATE CURRENT_TIMESTAMP, \`is_deleted\` tinyint NOT NULL DEFAULT false, \`name\` varchar(100) NOT NULL, \`code\` varchar(20) NOT NULL, \`address\` text NULL, \`phone\` varchar(20) NULL, \`email\` varchar(100) NULL, \`manager_name\` varchar(100) NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_d8b96d60ff9a288f5ed862280d\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`inventory_transactions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NULL ON UPDATE CURRENT_TIMESTAMP, \`is_deleted\` tinyint NOT NULL DEFAULT false, \`type\` enum ('IN', 'OUT', 'ADJUSTMENT', 'TRANSFER') NOT NULL, \`quantity\` int NOT NULL, \`quantity_before\` int NOT NULL, \`quantity_after\` int NOT NULL, \`reference\` varchar(100) NULL, \`notes\` text NULL, \`user_id\` int NULL, \`transaction_date\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`inventory_item_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`inventory_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NULL ON UPDATE CURRENT_TIMESTAMP, \`is_deleted\` tinyint NOT NULL DEFAULT false, \`quantity\` int NOT NULL DEFAULT '0', \`reserved_quantity\` int NOT NULL DEFAULT '0', \`last_stock_check\` timestamp NULL, \`location\` varchar(50) NULL, \`product_id\` int NOT NULL, \`warehouse_id\` int NOT NULL, UNIQUE INDEX \`IDX_8a1966ee908fde73f367016ac0\` (\`product_id\`, \`warehouse_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NULL ON UPDATE CURRENT_TIMESTAMP, \`is_deleted\` tinyint NOT NULL DEFAULT false, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`sku\` varchar(50) NOT NULL, \`barcode\` varchar(50) NULL, \`price\` decimal(10,2) NOT NULL, \`cost_price\` decimal(10,2) NULL, \`unit\` varchar(20) NOT NULL DEFAULT 'piece', \`min_stock_level\` int NOT NULL DEFAULT '0', \`max_stock_level\` int NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`category_id\` int NOT NULL, UNIQUE INDEX \`IDX_c44ac33a05b144dd0d9ddcf932\` (\`sku\`), UNIQUE INDEX \`IDX_adfc522baf9d9b19cd7d9461b7\` (\`barcode\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`updated_at\` \`updated_at\` datetime NULL ON UPDATE CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`is_deleted\` \`is_deleted\` tinyint NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_transactions\` ADD CONSTRAINT \`FK_e72ff3d54aa54059dbd70c41ee9\` FOREIGN KEY (\`inventory_item_id\`) REFERENCES \`inventory_items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_items\` ADD CONSTRAINT \`FK_8e17955a29e8b63bb8cec3d32c5\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_items\` ADD CONSTRAINT \`FK_8031a82801e54f045bfe79efc0a\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_9a5f6868c96e0069e699f33e124\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_9a5f6868c96e0069e699f33e124\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_items\` DROP FOREIGN KEY \`FK_8031a82801e54f045bfe79efc0a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_items\` DROP FOREIGN KEY \`FK_8e17955a29e8b63bb8cec3d32c5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_transactions\` DROP FOREIGN KEY \`FK_e72ff3d54aa54059dbd70c41ee9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`is_deleted\` \`is_deleted\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`updated_at\` \`updated_at\` datetime NULL ON UPDATE CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_adfc522baf9d9b19cd7d9461b7\` ON \`products\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_c44ac33a05b144dd0d9ddcf932\` ON \`products\``,
    );
    await queryRunner.query(`DROP TABLE \`products\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_8a1966ee908fde73f367016ac0\` ON \`inventory_items\``,
    );
    await queryRunner.query(`DROP TABLE \`inventory_items\``);
    await queryRunner.query(`DROP TABLE \`inventory_transactions\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_d8b96d60ff9a288f5ed862280d\` ON \`warehouses\``,
    );
    await queryRunner.query(`DROP TABLE \`warehouses\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_77d7eff8a7aaa05457a12b8007\` ON \`categories\``,
    );
    await queryRunner.query(`DROP TABLE \`categories\``);
  }
}
