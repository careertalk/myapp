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

//DBからjson取得
app.get('/xxx', async (c) => {
  //prismaを使用しDBコネクション
  const adapter = new PrismaD1(c.env.DB)
  const prisma = new PrismaClient({ adapter })
  //findManyで取得
  const prefectures = await prisma.prefecture.findMany()
  //json形式で返す
  return c.json(prefectures)
})


app.get('/api', (c) => {
  return c.json({ 今日のラッキーナンバー: 666 })
})


app.get('/posts/:id', (c) => {
  const page = c.req.query('page')
  const id = c.req.param('id')
  c.header('X-Message', 'Hi!')
  return c.text(`You want see ${page} of ${id}`)
})

export default app