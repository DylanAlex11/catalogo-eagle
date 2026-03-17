const SUPABASE_URL = "https://pomgdjmvymkscpocpayu.supabase.co";
const SUPABASE_KEY = "sb_publishable_9OazORM3uCHjS5r-BFU9eA_a_fAAChs";

// 👇 ESTA ES LA FORMA CORRECTA EN CDN V2
const { createClient } = supabase;

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);