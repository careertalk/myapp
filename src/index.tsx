export interface Env {
}
//共通で使うフレーム
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { renderer, AddTodo, Item } from './components'

//DBインスタンスの生成
type Bindings = {
  DB: D1Database
}
//テーブルインスタンスの生成
type Todo = {
  title: string
  id: string
}

//コンストラクタ
const app = new Hono<{ Bindings: Bindings }>()

//共通コンポーネント表示
app.get('*', renderer)

//表示メソッド
app.get('/', async (c) => {
  //DBからデータを分割代入で取得
  const { results } = await c.env.DB.prepare(`SELECT id, title FROM todo;`).all<Todo>()
  const todos = results

  //データ一覧をレンダリングする
  return c.render(
    <div>
      <AddTodo />
      {todos.map((todo) => {
        return <Item title={todo.title} id={todo.id} />
      })}
      <div id="todo"></div>
    </div>
  )
})

//送信メソッド
app.post(
  '/todo',
  zValidator(
    'form',
    z.object({
      title: z.string().min(1)
    })
  ),
  async (c) => {
    //リクエストのタイトル
    const { title } = c.req.valid('form')
    //連番
    const id = crypto.randomUUID()
    //DBにinsert
    await c.env.DB.prepare(`INSERT INTO todo(id, title) VALUES(?, ?);`).bind(id, title).run()
    //再レンダリング
    return c.html(<Item title={title} id={id} />)
  }
)

app.delete('/todo/:id', async (c) => {
  //リクエストのid
  const id = c.req.param('id')
  //DBにdel
  await c.env.DB.prepare(`DELETE FROM todo WHERE id = ?;`).bind(id).run()
  c.status(200)
  return c.body(null)
})

export default app


// export interface Env {
// }
// import { Hono } from 'hono'
// import { PrismaClient } from '@prisma/client'
// import { PrismaD1 } from '@prisma/adapter-d1'
// import { jsx } from 'hono/jsx'


// type Bindings = {
//   DB: D1Database
// }

// const app = new Hono<{ Bindings: Bindings }>()

// app.get('/', (c) => {
//   return c.html(
//       <html>
//           <head><script src="https://unpkg.com/htmx.org@1.9.10"></script></head>
//           <body>
//               <p>Hono!</p>
//               <button hx-get="/api" hx-target="#result">
//                   クリックしてAPIを呼ぶ
//               </button>
//               <pre><code id="result">JSON here...</code></pre>
//           </body>
//       </html>
//   )
// })

// //DBからjson取得
// app.get('/xxx', async (c) => {
//   //prismaを使用しDBコネクション
//   const adapter = new PrismaD1(c.env.DB)
//   const prisma = new PrismaClient({ adapter })
//   //findManyで取得
//   const prefectures = await prisma.prefecture.findMany()
//   //json形式で返す
//   return c.json(prefectures)
// })


// app.get('/api', (c) => {
//   return c.json({ 今日のラッキーナンバー: 666 })
// })


// app.get('/posts/:id', (c) => {
//   const page = c.req.query('page')
//   const id = c.req.param('id')
//   c.header('X-Message', 'Hi!')
//   return c.text(`You want see ${page} of ${id}`)
// })

// export default app


// import type { AuthConfig as AuthConfigCore } from '@auth/core'
// import { Auth } from '@auth/core'
// import type { AdapterUser } from '@auth/core/adapters'
// import type { JWT } from '@auth/core/jwt'
// import type { Session } from '@auth/core/types'
// import type { Context, MiddlewareHandler } from 'hono'
// import { env } from 'hono/adapter'
// import { HTTPException } from 'hono/http-exception'

// declare module 'hono' {
//   interface ContextVariableMap {
//     authUser: AuthUser
//     authConfig: AuthConfig
//   }
// }

// export type AuthEnv = {
//   AUTH_URL?: string
//   AUTH_SECRET: string
//   AUTH_REDIRECT_PROXY_URL?: string
//   [key: string]: string | undefined
// }

// export type AuthUser = {
//   session: Session
//   token?: JWT
//   user?: AdapterUser
// }

// export interface AuthConfig extends Omit<AuthConfigCore, 'raw'> {}

// export type ConfigHandler = (c: Context) => AuthConfig

// export function reqWithEnvUrl(req: Request, authUrl?: string): Request {
//   if (authUrl) {
//     const reqUrlObj = new URL(req.url)
//     const authUrlObj = new URL(authUrl)
//     const props = ['hostname', 'protocol', 'port', 'password', 'username'] as const
//     props.forEach((prop) => (reqUrlObj[prop] = authUrlObj[prop]))
//     return new Request(reqUrlObj.href, req)
//   } else {
//     return req
//   }
// }

// function setEnvDefaults(env: AuthEnv, config: AuthConfig) {
//   config.secret ??= env.AUTH_SECRET
//   config.basePath ??= '/api/auth'
//   config.trustHost = true
//   config.redirectProxyUrl ??= env.AUTH_REDIRECT_PROXY_URL
//   config.providers = config.providers.map((p) => {
//     const finalProvider = typeof p === 'function' ? p({}) : p
//     if (finalProvider.type === 'oauth' || finalProvider.type === 'oidc') {
//       const ID = finalProvider.id.toUpperCase()
//       finalProvider.clientId ??= env[`AUTH_${ID}_ID`]
//       finalProvider.clientSecret ??= env[`AUTH_${ID}_SECRET`]
//       if (finalProvider.type === 'oidc') {
//         finalProvider.issuer ??= env[`AUTH_${ID}_ISSUER`]
//       }
//     }
//     return finalProvider
//   })
// }

// export async function getAuthUser(c: Context): Promise<AuthUser | null> {
//   const config = c.get('authConfig')
//   let ctxEnv = env(c) as AuthEnv
//   setEnvDefaults(ctxEnv, config)
//   const origin = ctxEnv.AUTH_URL ? new URL(ctxEnv.AUTH_URL).origin : new URL(c.req.url).origin
//   const request = new Request(`${origin}${config.basePath}/session`, {
//     headers: { cookie: c.req.header('cookie') ?? '' },
//   })

//   let authUser: AuthUser = {} as AuthUser

//   const response = (await Auth(request, {
//     ...config,
//     callbacks: {
//       ...config.callbacks,
//       async session(...args) {
//         authUser = args[0]
//         const session = (await config.callbacks?.session?.(...args)) ?? args[0].session
//         const user = args[0].user ?? args[0].token
//         return { user, ...session } satisfies Session
//       },
//     },
//   })) as Response

//   const session = (await response.json()) as Session | null

//   return session && session.user ? authUser : null
// }

// export function verifyAuth(): MiddlewareHandler {
//   return async (c, next) => {
//     const authUser = await getAuthUser(c)
//     const isAuth = !!authUser?.token || !!authUser?.user
//     if (!isAuth) {
//       const res = new Response('Unauthorized', {
//         status: 401,
//       })
//       throw new HTTPException(401, { res })
//     } else {
//       c.set('authUser', authUser)
//     }

//     await next()
//   }
// }

// export function initAuthConfig(cb: ConfigHandler): MiddlewareHandler {
//   return async (c, next) => {
//     const config = cb(c)
//     c.set('authConfig', config)
//     await next()
//   }
// }

// export function authHandler(): MiddlewareHandler {
//   return async (c) => {
//     const config = c.get('authConfig')
//     let ctxEnv = env(c) as AuthEnv

//     setEnvDefaults(ctxEnv, config)

//     if (!config.secret) {
//       throw new HTTPException(500, { message: 'Missing AUTH_SECRET' })
//     }

//     const res = await Auth(reqWithEnvUrl(c.req.raw, ctxEnv.AUTH_URL), config)
//     return new Response(res.body, res)
//   }
// }