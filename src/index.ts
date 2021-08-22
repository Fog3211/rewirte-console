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
  /** 是否只针对字符串和数字类型 */
  strict?: boolean
  /** 过滤等级 */
  methods?: Method[]
}

export type Arguments = any[]

const DefaultOptions = {
  include: new RegExp('[\s\S]*'),
  exclude: new RegExp(''),
  strict: false,
  methods: []
}
const DefaultAvailableMethods: Method[] = ['debug', 'info', 'log', 'warn', 'error']
class MyConsole {
  private _console: Console
  private _options: Options
  private _trash: Arguments

  constructor(options?: Options) {
    this._console = window.console
    this._options = Object.assign({}, DefaultOptions, options)
    this._trash = []
  }

  // 检查是否匹配
  private checkArgument(target: string, include: RegExp, exclude: RegExp) {
    return include.test(target) && !exclude.test(target)
  }
  // 计算过滤后的参数
  private getArguments(args: IArguments) {
    const { include, exclude, strict } = this._options
    const [arg0] = args
    if (typeof arg0 === 'string' || typeof arg0 === 'number') {
      if (this.checkArgument(String(arg0), include!, exclude!)) {
        return args
      } else {
        this._trash.push(args)
        return []
      }
    } else {
      if (strict) {
        this._trash.push(args)
        return []
      } else {
        return args
      }
    }
  }
  // 过滤函数
  public filter(options: Options) {
    this._options = Object.assign({}, this._options, options)
    const { methods = [] } = this._options
    const availableMethods: Method[] = methods.length === 0 ? DefaultAvailableMethods : methods

    DefaultAvailableMethods.forEach(method => {
      if (availableMethods.includes(method)) {
        window.console[method].prototype = () => {
          this._console[method].apply(this._console, this.getArguments(arguments) as Arguments);
        };
      } else {
        window.console[method] = () => { }
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
    return this._trash
  }
  /** 清空回收站的log */
  public clearTrash() {
    this._trash = []
  }
}

export default MyConsole
