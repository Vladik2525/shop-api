import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    database: 'shop-db',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    host: 'localhost',
    username: 'postgres',
    password: 'VladikPro',
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource