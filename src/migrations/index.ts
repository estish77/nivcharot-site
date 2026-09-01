import * as migration_20260825_070053_initial_schema from './20260825_070053_initial_schema';
import * as migration_20260826_074724_add_timeline_external_articles from './20260826_074724_add_timeline_external_articles';
import * as migration_20260826_140531_add_events_summary from './20260826_140531_add_events_summary';
import * as migration_20260826_155435_add_press_archive_home_excerpt from './20260826_155435_add_press_archive_home_excerpt';
import * as migration_20260827_103725_backlog_2026_08_27 from './20260827_103725_backlog_2026_08_27';
import * as migration_20260828_074727_program_applications from './20260828_074727_program_applications';
import * as migration_20260829_121954_appreciations from './20260829_121954_appreciations';
import * as migration_20260901_090625_campaigns_global from './20260901_090625_campaigns_global';

export const migrations = [
  {
    up: migration_20260825_070053_initial_schema.up,
    down: migration_20260825_070053_initial_schema.down,
    name: '20260825_070053_initial_schema',
  },
  {
    up: migration_20260826_074724_add_timeline_external_articles.up,
    down: migration_20260826_074724_add_timeline_external_articles.down,
    name: '20260826_074724_add_timeline_external_articles',
  },
  {
    up: migration_20260826_140531_add_events_summary.up,
    down: migration_20260826_140531_add_events_summary.down,
    name: '20260826_140531_add_events_summary',
  },
  {
    up: migration_20260826_155435_add_press_archive_home_excerpt.up,
    down: migration_20260826_155435_add_press_archive_home_excerpt.down,
    name: '20260826_155435_add_press_archive_home_excerpt',
  },
  {
    up: migration_20260827_103725_backlog_2026_08_27.up,
    down: migration_20260827_103725_backlog_2026_08_27.down,
    name: '20260827_103725_backlog_2026_08_27',
  },
  {
    up: migration_20260828_074727_program_applications.up,
    down: migration_20260828_074727_program_applications.down,
    name: '20260828_074727_program_applications',
  },
  {
    up: migration_20260829_121954_appreciations.up,
    down: migration_20260829_121954_appreciations.down,
    name: '20260829_121954_appreciations',
  },
  {
    up: migration_20260901_090625_campaigns_global.up,
    down: migration_20260901_090625_campaigns_global.down,
    name: '20260901_090625_campaigns_global'
  },
];
