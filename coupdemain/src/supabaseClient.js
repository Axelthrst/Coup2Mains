import { createClient } from "@supabase/supabase-js";

// Ces deux valeurs viennent de Supabase → Project Settings → API
// En local : mets-les dans un fichier .env à la racine du projet :
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
// Sur Vercel : Project Settings → Environment Variables (mêmes noms)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);