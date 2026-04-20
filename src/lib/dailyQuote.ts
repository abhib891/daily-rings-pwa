export type DailyQuote = {
  text: string
  author: string
}

const FALLBACK: DailyQuote[] = [
  {
    text: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain',
  },
  {
    text: 'Small deeds done are better than great deeds planned.',
    author: 'Peter Marshall',
  },
  {
    text: 'You don’t have to be extreme, just consistent.',
    author: 'Unknown',
  },
  {
    text: 'Energy and persistence conquer all things.',
    author: 'Benjamin Franklin',
  },
  {
    text: 'Well done is better than well said.',
    author: 'Benjamin Franklin',
  },
  {
    text: 'It always seems impossible until it’s done.',
    author: 'Nelson Mandela',
  },
  {
    text: 'Start where you are. Use what you have. Do what you can.',
    author: 'Arthur Ashe',
  },
  {
    text: 'The only bad workout is the one that didn’t happen.',
    author: 'Unknown',
  },
  {
    text: 'Discipline is choosing between what you want now and what you want most.',
    author: 'Unknown',
  },
  {
    text: 'Progress, not perfection.',
    author: 'Unknown',
  },
]

function pickFallback(): DailyQuote {
  return FALLBACK[Math.floor(Math.random() * FALLBACK.length)]!
}

/**
 * Fetches a random quote (changes each full page load). Falls back to a local
 * list if the network or API is unavailable.
 */
export async function fetchDailyQuote(signal?: AbortSignal): Promise<DailyQuote> {
  try {
    const url =
      'https://api.quotable.io/random?tags=motivational|inspirational|wisdom&maxLength=240'
    const res = await fetch(url, { signal, cache: 'no-store' })
    if (!res.ok) throw new Error(String(res.status))
    const data = (await res.json()) as { content?: string; author?: string }
    if (typeof data.content === 'string' && typeof data.author === 'string') {
      return { text: data.content, author: data.author }
    }
  } catch {
    /* use fallback */
  }
  return pickFallback()
}
