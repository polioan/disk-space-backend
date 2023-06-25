import express from 'express'
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import fileupload from 'express-fileupload'
import { errorHandler } from './middlewares/errorHandler.js'
import dotenv from 'dotenv-safe'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json({ limit: +process.env.STORAGE_SIZE_LIMIT }))
app.use(fileupload({ defCharset: 'utf8', defParamCharset: 'utf8' }))
app.disable('x-powered-by')

global.__filename = fileURLToPath(import.meta.url)
global.__dirname = path.dirname(__filename)

async function setupRoutes() {
  const routes = await fs.readdir(path.join(__dirname, 'routes'))
  for (const route of routes) {
    const routeName = path.parse(route).name
    try {
      const module = await import(`./routes/${routeName}.js`)
      app.use(`/api/${routeName}`, module.default)
    } catch (e) {
      if (process.env.NODE_ENV === 'production') {
        throw e
      }
      console.warn(`Can't load route - ${routeName}`, e)
    }
  }
}

async function start() {
  await setupRoutes()
  app.use(errorHandler)
  console.log('Routes and error handler are set')

  try {
    await fs.mkdir(path.resolve(process.env.USER_DATA_PATHNAME))
    console.log('Userdata folder created')
  } catch (e) {
    if (e instanceof Error && 'code' in e && e.code === 'EEXIST') {
      console.log('Userdata folder already created')
    } else {
      throw e
    }
  }

  app.use(
    '/',
    express.static(path.join(__dirname, '..', '..', 'frontend', 'dist'))
  )
  app.get('*', (_, res) => {
    res.sendFile(
      path.join(__dirname, '..', '..', 'frontend', 'dist', 'index.html')
    )
  })
  console.log('Added react static frontend')

  await new Promise<void>(resolve => app.listen(process.env.PORT, resolve))
  console.log('Express started')
}

start()
  .then(() => console.log(`Server ready at port ${process.env.PORT}`))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
