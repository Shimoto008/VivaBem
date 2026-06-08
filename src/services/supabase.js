import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://droyetwacquvwqjinatl.supabase.co'
const supabaseAnonKey = 'sb_publishable_b_AXSlIUtHwPtUopX19eKA_IY735ebm'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)