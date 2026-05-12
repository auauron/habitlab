import type { Session, User } from '@supabase/supabase-js'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import {
  archiveHabit as archiveHabitRemote,
  createHabit,
  fetchHabitLabSnapshot,
  todayKey,
  upsertDailyCheckin,
  upsertHabitLog,
  type CheckinDraft,
  type HabitDraft,
} from './backend'
import type { DailyCheckin, Habit, HabitLog, HabitLogStatus } from './types'

type HabitLabContextValue = {
  isConfigured: boolean
  isLoading: boolean
  isSignedIn: boolean
  user: User | null
  userLabel: string
  today: string
  habits: Habit[]
  logs: HabitLog[]
  checkins: DailyCheckin[]
  error: string | null
  notice: string | null
  signInWithEmail: (email: string) => Promise<void>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
  addHabit: (draft: HabitDraft) => Promise<void>
  archiveHabit: (habitId: string) => Promise<void>
  setHabitStatus: (
    habitId: string,
    date: string,
    status: HabitLogStatus,
  ) => Promise<void>
  saveCheckin: (date: string, draft: CheckinDraft) => Promise<void>
}

const HabitLabContext = createContext<HabitLabContextValue | null>(null)

export function HabitLabProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [checkins, setCheckins] = useState<DailyCheckin[]>([])
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const today = todayKey()

  const refresh = useCallback(async () => {
    if (!supabase || !session?.user) {
      setHabits([])
      setLogs([])
      setCheckins([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const snapshot = await fetchHabitLabSnapshot(session.user)
      setHabits(snapshot.habits)
      setLogs(snapshot.logs)
      setCheckins(snapshot.checkins)
    } catch (cause) {
      setError(getErrorMessage(cause))
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false)
      return
    }

    let isMounted = true

    supabase.auth.getSession().then(({ data, error: authError }) => {
      if (!isMounted) return
      if (authError) setError(authError.message)
      setSession(data.session)
      if (!data.session) setIsLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setNotice(null)
    })

    return () => {
      isMounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo<HabitLabContextValue>(
    () => ({
      isConfigured: isSupabaseConfigured,
      isLoading,
      isSignedIn: Boolean(session?.user),
      user: session?.user ?? null,
      userLabel:
        session?.user.email ??
        session?.user.id?.slice(0, 8) ??
        'Personal workspace',
      today,
      habits,
      logs,
      checkins,
      error,
      notice,
      signInWithEmail: async (email: string) => {
        if (!supabase) {
          setError('Supabase is not configured.')
          return
        }

        setError(null)
        setNotice(null)

        const { error: signInError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo:
              typeof window === 'undefined'
                ? undefined
                : `${window.location.origin}/today`,
          },
        })

        if (signInError) {
          setError(signInError.message)
          return
        }

        setNotice('Magic link sent. Open it to unlock your HabitLab data.')
      },
      signOut: async () => {
        if (!supabase) return
        await supabase.auth.signOut()
        setSession(null)
        setHabits([])
        setLogs([])
        setCheckins([])
      },
      refresh,
      addHabit: async (draft: HabitDraft) => {
        if (!session?.user) return
        setError(null)
        try {
          const habit = await createHabit(session.user, draft)
          setHabits((current) => [...current, habit])
        } catch (cause) {
          setError(getErrorMessage(cause))
        }
      },
      archiveHabit: async (habitId: string) => {
        setError(null)
        try {
          await archiveHabitRemote(habitId)
          setHabits((current) => current.filter((habit) => habit.id !== habitId))
        } catch (cause) {
          setError(getErrorMessage(cause))
        }
      },
      setHabitStatus: async (
        habitId: string,
        date: string,
        status: HabitLogStatus,
      ) => {
        if (!session?.user) return
        setError(null)
        try {
          const log = await upsertHabitLog(session.user, habitId, date, status)
          setLogs((current) => [
            log,
            ...current.filter(
              (entry) => !(entry.habitId === habitId && entry.date === date),
            ),
          ])
        } catch (cause) {
          setError(getErrorMessage(cause))
        }
      },
      saveCheckin: async (date: string, draft: CheckinDraft) => {
        if (!session?.user) return
        setError(null)
        try {
          const checkin = await upsertDailyCheckin(session.user, date, draft)
          setCheckins((current) => [
            checkin,
            ...current.filter((entry) => entry.date !== date),
          ])
          setNotice('Saved to Supabase.')
        } catch (cause) {
          setError(getErrorMessage(cause))
        }
      },
    }),
    [checkins, error, habits, isLoading, logs, notice, refresh, session, today],
  )

  return (
    <HabitLabContext.Provider value={value}>{children}</HabitLabContext.Provider>
  )
}

export function useHabitLab() {
  const context = useContext(HabitLabContext)

  if (!context) {
    throw new Error('useHabitLab must be used inside HabitLabProvider.')
  }

  return context
}

function getErrorMessage(cause: unknown): string {
  if (cause instanceof Error) {
    return cause.message
  }

  return 'Something went wrong while talking to Supabase.'
}
