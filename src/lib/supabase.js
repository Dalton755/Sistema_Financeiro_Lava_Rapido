import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  'https://xgbdurmauhwpbiesdqmi.supabase.co'

const supabaseKey =
  'sb_publishable_tTMRtaZ8eNY3vAvCHo19jw_f4FdPN7U'

export const supabase =
  createClient(
    supabaseUrl,
    supabaseKey
  )