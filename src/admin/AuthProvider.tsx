import { createContext, useContext, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabase } from '../lib/supabase'

interface Auth { loading: boolean; session: Session | null; isAdmin: boolean; signIn(email: string, password: string): Promise<string | null>; signOut(): Promise<void> }
const Ctx = createContext<Auth>(null!)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = getSupabase()
    sb.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    let live = true
    if (!session) { setAdmin(false); setLoading(false); return }
    setLoading(true)
    getSupabase().from('admin_users').select('user_id').eq('user_id', session.user.id).maybeSingle()
      .then(({ data }) => { if (live) { setAdmin(!!data); setLoading(false) } })
    return () => { live = false }
  }, [session])

  const signIn: Auth['signIn'] = async (email, password) => {
    const { error } = await getSupabase().auth.signInWithPassword({ email: email.trim(), password })
    return error ? 'E-mail ou senha incorretos.' : null
  }
  const signOut = async () => { await getSupabase().auth.signOut() }
  return <Ctx.Provider value={{ loading, session, isAdmin, signIn, signOut }}>{children}</Ctx.Provider>
}
