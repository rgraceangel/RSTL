--------------------------------------------------------------------------------
-- Performance pass (found during a full-project test/audit pass).
--
-- `startGameSessionAction` (lib/actions/game-sessions.ts) runs this exact
-- query on every single play attempt, for every game type, before anything
-- else -- it's the hottest read in the whole player-facing path:
--
--   select id from game_sessions where game_id = ? and player_id = ?
--   (count, to enforce max_attempts_per_user)
--
-- `game_sessions` already has single-column indexes on `game_id` and
-- `player_id` separately (20260709010900_game_sessions.sql), which Postgres
-- *can* combine with a bitmap AND, but a single composite index serves this
-- exact two-column equality lookup directly and is cheaper at scale. Added
-- here rather than replacing either single-column index, since `game_id`
-- alone is still used on its own by the Analytics RPCs (Section 19) and
-- `deleteGameAction`'s existence check.
--------------------------------------------------------------------------------

create index if not exists idx_game_sessions_game_player
  on public.game_sessions (game_id, player_id);
