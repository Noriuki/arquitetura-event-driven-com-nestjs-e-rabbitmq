import { DataSource, DataSourceOptions } from 'typeorm';
import { getTypeOrmOptions } from './typeorm-options';

/** Usado pelo CLI: `yarn migration:run` */
export default new DataSource({
  ...(getTypeOrmOptions() as DataSourceOptions),
  migrationsRun: false,
});
