export interface Env {
}

import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
import { jsx } from 'hono/jsx'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/xxx', async (c) => {
  const adapter = new PrismaD1(c.env.DB)
  const prisma = new PrismaClient({ adapter })

  const prefectures = await prisma.prefecture.findMany()
  return c.json(prefectures)
})

app.get('/', (c) => {
  return c.html(
      <html>
          <head><script src="https://unpkg.com/htmx.org@1.9.10"></script></head>
          <body>
              <p>Hono!</p>
              <button hx-get="/api" hx-target="#result">
                  クリックしてAPIを呼ぶ
              </button>
              <pre><code id="result">JSON here...</code></pre>
          </body>
      </html>
  )
})

app.get('/api', (c) => {
  return c.json({ 今日のラッキーナンバー: 666 })
})

export default app