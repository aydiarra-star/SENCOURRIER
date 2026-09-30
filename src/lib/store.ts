import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Pool } from 'pg';
import { seedState } from './content';
import type { State } from './types';

const file = path.join(process.cwd(), 'data', 'state.json');
let pool: Pool | undefined;
let queue: Promise<unknown> = Promise.resolve();
const cloneSeed = (): State => structuredClone(seedState);

async function readFile(): Promise<State> {
 try { return JSON.parse(await fs.readFile(file,'utf8')) as State; }
 catch (e) { if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e; return cloneSeed(); }
}
function getPool() { if (!pool) pool = new Pool({connectionString:process.env.DATABASE_URL, max:5}); return pool; }
async function ensureTable() { await getPool().query('CREATE TABLE IF NOT EXISTS app_state (id integer PRIMARY KEY, data jsonb NOT NULL)'); await getPool().query('INSERT INTO app_state (id,data) VALUES (1,$1) ON CONFLICT (id) DO NOTHING',[JSON.stringify(seedState)]); }
export async function getState(): Promise<State> {
 if (!process.env.DATABASE_URL) return readFile();
 await ensureTable(); const result = await getPool().query('SELECT data FROM app_state WHERE id = 1'); return result.rows[0].data as State;
}
export async function updateState<T>(fn: (state:State)=>T): Promise<T> {
 if (process.env.DATABASE_URL) {
  await ensureTable(); const client = await getPool().connect();
  try { await client.query('BEGIN'); const result = await client.query('SELECT data FROM app_state WHERE id = 1 FOR UPDATE'); const state = result.rows[0].data as State; const value = fn(state); await client.query('UPDATE app_state SET data=$1 WHERE id=1',[JSON.stringify(state)]); await client.query('COMMIT'); return value; }
  catch(e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
 }
 const task = queue.then(async () => { const state = await readFile(); const value = fn(state); await fs.mkdir(path.dirname(file),{recursive:true}); const tmp = `${file}.${process.pid}.tmp`; await fs.writeFile(tmp,JSON.stringify(state,null,2)); await fs.rename(tmp,file); return value; });
 queue = task.catch(()=>{}); return task;
}
