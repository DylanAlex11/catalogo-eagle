const SUPABASE_URL = "https://pomgdjmvymkscpocpayu.supabase.co";
const SUPABASE_KEY = "sb_publishable_9OazORM3uCHjS5r-BFU9eA_a_fAAChs";

// 👇 forma segura para CDN
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);