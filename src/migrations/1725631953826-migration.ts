import { EntityNames } from 'src/common/enums/entity.enum';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Migration1725631953826 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.createTable(
    //   new Table({
    //     name: EntityNames.User,
    //     columns: [
    //       {
    //         name: 'id',
    //         isPrimary: true,
    //         type: 'serial',
    //         isNullable: false,
    //         isUnique: true,
    //       },
    //       {
    //         name: 'username',
    //         isPrimary: true,
    //         type: 'character varying(50)',
    //         isNullable: true,
    //         isUnique: true,
    //       },
    //       {
    //         name: 'phone',
    //         isPrimary: true,
    //         type: 'character varying(12)',
    //         isNullable: true,
    //         isUnique: true,
    //       },
    //       {
    //         name: 'email',
    //         isPrimary: true,
    //         type: 'character varying(100)',
    //         isNullable: true,
    //         isUnique: true,
    //       },
    //       {
    //         name: 'role',
    //         isPrimary: true,
    //         type: 'enum',
    //         enum: [Roles.Admin, Roles.User],
    //       },
    //       {
    //         name: 'status',
    //         isPrimary: true,
    //         type: 'character varying(100)',
    //         isNullable: true,
    //         enum: [UserStatus.Block, UserStatus.Report],
    //       },
    //     ],
    //   }),
    // );

    //@ts-ignore
    // await queryRunner.addColumn(EntityNames.User, {
    //   name: 'addC',
    //   type: 'numeric',
    // });

    // //changecolumn

    // //queryRunner.query(ایجاد تغییرات با کودری)

    await queryRunner.createTable(
      new Table({
        name: EntityNames.Profile,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            isUnique: true,
            generationStrategy: 'increment',
          },
          {
            name: 'nik_name',
            type: 'varchar(50)',
            isNullable: true,
          },
          {
            name: 'bio',
            type: 'varchar',
            isNullable: true,
          },
          { name: 'image_profile', type: 'varchar', isNullable: true },
          // { name: 'userId', type: 'int', isUnique: true },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      EntityNames.Profile,
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: EntityNames.User,
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //dropcolumn}
    //const user = await queryRunner.getTable(EntityNames.User);
    // const userFk = user.foreignKeys.find(
    //   (fk) => fk.columnNames.indexOf('profileId') !== -1,
    // );
    // if (userFk) {
    //   await queryRunner.dropForeignKey(EntityNames.User, userFk);
    // }
    //await queryRunner.dropTable(EntityNames.User,true)
  }
}
