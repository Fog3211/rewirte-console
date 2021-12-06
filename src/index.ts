export type Method =
  | 'debug'
  | 'info'
  | 'log'
  | 'warn'
  | 'error'

export type Options = {
  /** 匹配规则 */
  include?: RegExp
  /** 排除规则 */
  exclude?: RegExp
  /** 是否匹配全部参数 */
  global?: boolean
  /** 过滤等级 */
  methods?: Method[]
}

export type Arguments = any[]

const DefaultOptions = {
  include: new RegExp('[\s\S]*'),
  exclude: new RegExp(''),
  global: false,
  methods: []
}
const DefaultAvailableMethods: Method[] = ['debug', 'info', 'log', 'warn', 'error']
class MyConsole {
  private _console: Console
  private options: Options
  private trash: Record<string, Arguments>[]

  constructor(options?: Options) {
    this._console = window.console
    this.options = Object.assign({}, DefaultOptions, options)
    this.trash = []
  }

  /** 检查是否匹配 */
  private checkArgument(target: string, include: RegExp, exclude: RegExp) {
    return include.test(target) && !exclude.test(target)
  }
  /** 计算过滤后的参数 */
  private getArguments(...args: any[]) {
    const { include, exclude, global } = this.options
    const [arg0] = args
    if (global) {
      if (this.checkArgument(arg0.toString(), include!, exclude!)) {
        return args
      } else {
        this.moveToTrash(args)
        return []
      }
    } else {
      const isMatch = args.every(arg => this.checkArgument(arg.toString(), include!, exclude!))
      if (isMatch) {
        return args
      } else {
        this.moveToTrash(args)
        return []
      }
    }
  }
  /** 过滤函数 */
  public filter(options: Options) {
    this.options = Object.assign({}, this.options, options)
    const { methods = [] } = this.options
    const availableMethods: Method[] = methods.length === 0 ? DefaultAvailableMethods : methods

    DefaultAvailableMethods.forEach(method => {
      if (availableMethods.includes(method)) {
        window.console[method].apply(window.console[method], this.getArguments(arguments) as Arguments)
      } else {
        window.console[method] = (...args) => {
          this.moveToTrash(args)
        }
      }
    })
  }
  /** 重置console */
  public reset() {
    this.clearTrash()
    window.console = this._console
  }
  /** 查看过滤掉的log */
  public getTrash() {
    return this.trash
  }
  /** 添加回收站的log */
  public moveToTrash(...args: any[]) {
    this.trash.push({
      [new Date().getTime()]: args
    })
  }
  /** 清空回收站的log */
  public clearTrash() {
    this.trash = []
  }
}

export default MyConsole
