import { create } from 'dva-core'

let app: { model: (arg0: any) => any; use: (arg0: { onError(err: any): void }) => void; start: () => void; _store: any; getStore: { (): { (): any; new(): any; getState: { (): any; new(): any } }; dispatch: any; }; dispatch: (arg0: any) => any }
let store: { dispatch: any }
let dispatch
let registered: boolean

function createApp (opt: { models: any[] }) {
  // redux 的日志
  // if (opt.enableLog) {
  //   opt.onAction = [createLogger()]
  // }

  app = create(opt)

  if (!registered) {
    opt.models.forEach((model) => {
      return app.model(model)
    })
  }
  registered = true

  // https://dvajs.com/api/#app-dva-opts
  app.use({
    onError (err) {
      console.log('dva.js onError=', err)
    }
  })

  app.start()

  store = app._store
  // @ts-ignore
  app.getStore = () => store

  dispatch = store.dispatch
  app.dispatch = dispatch
  console.log('dva.js app=', app)

  return app
}

export default {
  createApp,
  // 任何地方都可以访问到dispatch
  getDispatch (p: object) {
    return app.dispatch(p)
  },
  // 任何地方都可访问到的所有model的 集合
  getState: () => {
    const state = app.getStore().getState()
    console.log('dva.js getState=', state)
    return state
  },
  getStore: () => {
    return app.getStore()
  }
}
