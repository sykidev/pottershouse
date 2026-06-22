import type { Logger } from 'pino';
import { syncCompletedBroadcasts } from '../routes/sermons.js';

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
// Small delay so the import doesn't compete with server startup.
const STARTUP_DELAY_MS = 15 * 1000;

/**
 * Schedule the YouTube → sermons import. There is no YouTube webhook, so we
 * poll: once shortly after boot, then every 6 hours. As soon as a livestream
 * flips to "completed" on YouTube it gets pulled into the sermons table, so
 * public requests only ever read from the DB (never the YouTube API).
 *
 * Safe to call when YouTube is unconfigured — the job just logs and skips.
 */
export function startYoutubeSyncJob(logger: Logger): void {
  if (!process.env.YoutubeApiKey || !process.env.YoutubeChannelId) {
    logger.warn('YouTube sync job disabled (missing YoutubeApiKey / YoutubeChannelId).');
    return;
  }

  let running = false;
  const run = async () => {
    if (running) return; // never overlap two syncs
    running = true;
    try {
      const { imported, found } = await syncCompletedBroadcasts();
      logger.info({ imported, found }, 'YouTube sermon sync complete');
    } catch (error) {
      logger.error({ err: error }, 'YouTube sermon sync failed');
    } finally {
      running = false;
    }
  };

  setTimeout(run, STARTUP_DELAY_MS);
  setInterval(run, SIX_HOURS_MS).unref(); // don't keep the process alive for the timer
  logger.info('YouTube sermon sync scheduled (startup + every 6h).');
}
