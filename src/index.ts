export type Method =
  | 'debug'
  | 'info'
  | 'log'
  | 'warn'
  | 'error'

export type Options = {
  /** 匹配规则 */
  include?: (string | RegExp)[]
  /** 排除规则 */
  exclude?: (string | RegExp)[]
  /**是否对整个console匹配 */
  global?: boolean
  /** 过滤等级 */
  methods?: Method[]
}

const DefaultOptions: Options = {
  global: true,
  methods: []
}
class MyConsole {
  private _console: Console
  private _options: Options

  constructor(options?: Options) {
    this._console = window.console
    this._options = options || DefaultOptions
  }

  // 计算过滤后的参数
  private getArguments(args: IArguments) {
    const { include = [], exclude = [], global = true } = this._options
    if (include.length === 0 && exclude.length === 0) return args
    const [arg0, ...restArg] = args
    if (global === false) { // 只匹配第一个参数
      if (typeof arg0 === 'string') {

      } else {
        return args
      }
    } else {

    }
    return args
  }
  // 过滤函数
  public filter(options: Options) {
    this._options = Object.assign({}, this._options, options)
    const { methods = [] } = this._options
    const availableMethods: Method[] = methods.length === 0 ? ['debug', 'info', 'log', 'warn', 'error'] : methods

    availableMethods.forEach(method => {
      window.console[method].prototype = () => {
        this._console[method].apply(this._console, this.getArguments(arguments) as any);
      };
    })
  }
  /** 重置console */
  public reset() {
    window.console = this._console
  }
}

export default MyConsole
