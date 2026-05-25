import { DataSource, DataSourceOptions } from 'typeorm';
import { getTypeOrmOptions } from './typeorm-options';

export default new DataSource({
  ...(getTypeOrmOptions() as DataSourceOptions),
  migrationsRun: false,
});
