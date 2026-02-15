// Mock Supabase client - no real connection, returns empty data
// This prevents any changes from affecting the real database

const emptyResponse = { data: [], error: null, count: 0 };
const emptySingle = { data: null, error: null };

function createMockQueryBuilder(): any {
  const builder: any = {};
  const chainMethods = [
    'select', 'insert', 'update', 'delete', 'upsert',
    'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike',
    'is', 'in', 'contains', 'containedBy', 'range',
    'textSearch', 'match', 'not', 'or', 'filter',
    'order', 'limit', 'offset',
    'maybeSingle', 'single',
    'csv', 'geojson', 'explain',
    'rollback', 'returns',
  ];

  const terminalMethods = ['single', 'maybeSingle'];

  chainMethods.forEach((method) => {
    builder[method] = (..._args: any[]) => {
      if (terminalMethods.includes(method)) {
        return Promise.resolve(emptySingle);
      }
      return builder;
    };
  });

  // Make the builder thenable so `await query` works
  builder.then = (resolve: any) => resolve({ ...emptyResponse });

  return builder;
}

function createMockChannel(): any {
  const channel: any = {};
  channel.on = () => channel;
  channel.subscribe = () => channel;
  channel.unsubscribe = () => {};
  return channel;
}

export const supabase = {
  from: (_table: string) => createMockQueryBuilder(),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: (_creds: any) => Promise.resolve({ data: { session: null, user: null }, error: { message: "Auth disabled in this environment" } }),
    signUp: (_creds: any) => Promise.resolve({ data: { session: null, user: null }, error: { message: "Auth disabled in this environment" } }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: (_callback: any) => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  },
  channel: (_name: string) => createMockChannel(),
  removeChannel: (_channel: any) => {},
  storage: {
    from: (_bucket: string) => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      download: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: (_path: string) => ({ data: { publicUrl: "" } }),
      list: () => Promise.resolve({ data: [], error: null }),
      remove: () => Promise.resolve({ data: null, error: null }),
    }),
  },
} as any;
