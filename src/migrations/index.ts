import * as migration_20260825_070053_initial_schema from './20260825_070053_initial_schema';
import * as migration_20260826_074724_add_timeline_external_articles from './20260826_074724_add_timeline_external_articles';

export const migrations = [
  {
    up: migration_20260825_070053_initial_schema.up,
    down: migration_20260825_070053_initial_schema.down,
    name: '20260825_070053_initial_schema',
  },
  {
    up: migration_20260826_074724_add_timeline_external_articles.up,
    down: migration_20260826_074724_add_timeline_external_articles.down,
    name: '20260826_074724_add_timeline_external_articles'
  },
];
