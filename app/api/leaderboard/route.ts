import { supabase } from '@/lib/supabaseClient'

type LeaderboardEntry = {
  nickname: string
  score: number
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LeaderboardEntry
    const { nickname, score } = body

    if (!nickname || score == null)
      return Response.json({ error: 'Missing fields' }, { status: 400 })

    // بررسی اینکه آیا کاربر وجود دارد یا نه
    const { data: existingUser, error: fetchError } = await supabase
      .from('leaderboard')
      .select('id, score')
      .eq('nickname', nickname)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // اگر خطا غیر از "not found" بود
      throw fetchError
    }

    if (!existingUser) {
      // رکورد جدید
      const { error: insertError } = await supabase
        .from('leaderboard')
        .insert([{ nickname, score }])

      if (insertError) throw insertError

      return Response.json({ message: 'Score added successfully' })
    } else {
      // اگر امتیاز جدید بیشتر بود → آپدیت کن
      if (score > existingUser.score) {
        const { error: updateError } = await supabase
          .from('leaderboard')
          .update({ score })
          .eq('id', existingUser.id)

        if (updateError) throw updateError

        return Response.json({ message: 'Score updated successfully' })
      } else {
        return Response.json({ message: 'Score not higher, no update made' })
      }
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json(data)
}
