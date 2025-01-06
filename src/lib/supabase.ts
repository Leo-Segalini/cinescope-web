import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zyfbtfbjjoxiciemfekc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5ZmJ0ZmJqam94aWNpZW1mZWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNTYwNDAsImV4cCI6MjA1MTczMjA0MH0.lenetOXIpRnx43u5Z9wTMDPT38dEqQfPpc7DS3hsmk8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 