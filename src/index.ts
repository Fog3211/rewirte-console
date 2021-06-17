declare global {
  interface Window {
    _console: typeof window.console
  }
}

export type Options = {
  /** 匹配规则 */
  include?: (string | RegExp)[]
  /** 排除规则 */
  exclude?: (string | RegExp)[]
  /** 是否识别颜色 */
  colorful?: boolean
  /**是否对整个console匹配 */
  global?: boolean
  /** 是否展示数据类型 */
  showType?: boolean
}

/** 重写console方法 */
const rewriteConsole = (options: Options) => {
  console.log('s')
  window._console = window.console
}

/** 重置console */
const resetConsole = () => {
  if (window._console) {
    window.console = window._console
  } else {
    location.reload()
  }
}

export {
  rewriteConsole,
  resetConsole
}
