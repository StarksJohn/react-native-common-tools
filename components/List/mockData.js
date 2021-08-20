
/**
 * 模拟 https://bolan9999.github.io/react-native-largelist/#/zh-cn/V3/BigMedia 大图片视频列表
 * @type {[{items: string[]}, {items: string[]}, {items: string[]}]}
 */

/**
 * 模拟 不等高的 一个section 的 数据源
 * @type {string[]}
 */
const one_section_array = [
  // 第一页
  ['https://images.unsplash.com/photo-1624916888351-a18f955a1b93?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ0NTE1Nw&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1626743702655-543c7789cd4d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ0NTI4MQ&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/flagged/photo-1625836014110-880aae477f2b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ0NTI5NQ&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1626938929084-9a208ef71966?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ0NTMwNw&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1626772699189-70c18061e19f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ0NTMxNg&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1625154530002-54c2165faa17?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ0NTMyNw&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1626619640460-7909f3d69043?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ0NTMzNw&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1625424629172-4de23aa6dd9a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ0NTM0NQ&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1626304757781-669070badc44?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDEyOA&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1627297511458-b18880b542a9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDEzNw&ixlib=rb-1.2.1&q=80&w=300'],
  // 第二页
  ['https://images.unsplash.com/photo-1625893356075-7ba34a92d241?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDE0NA&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1625204941196-17add9472d8f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDE2NQ&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1624937392438-ad680b36902b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDE3Mw&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1626334418713-ba430eaa2677?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDE4MA&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1627117156598-16bfc3b13cf5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDE4OA&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1625390121632-5c3b48bcc6cd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDE5OQ&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1626775920324-fdd5eb90654d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDIwNQ&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1625029117304-2f0299e7b544?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDIxMQ&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1625089168404-39770c5803b4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDIxNw&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1625449743379-39dc56f49380?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDI0MA&ixlib=rb-1.2.1&q=80&w=300'],
  // 第三页
  ['https://images.unsplash.com/photo-1627088271575-b0745fca4356?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDI1MQ&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1625317222753-b84108a18db6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDI1OQ&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1626800681383-a069a314d98c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDI2NQ&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1625851740514-6ce39269bc40?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDI3MQ&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1625283518288-00362afc8663?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDI3OA&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1624937871114-7a38657bb2a7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDI4NQ&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1624910986431-576063678153?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDI5Mw&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1625262060409-bc449891bb80?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDI5OQ&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1625679571888-2375f0ec600d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDMwNQ&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1626878163462-b193fdd86e46?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDMxMQ&ixlib=rb-1.2.1&q=80&w=300'],
  // 第四页
  ['https://images.unsplash.com/photo-1625766991377-c6a785264ede?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDMyMw&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1624916888608-0d65572fc732?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDMyOQ&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1625144778908-a0cac2794cd3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDMzNQ&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1625088886134-7d4d45bbeaf4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDM1MA&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1626103989191-05f5e081e0bf?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDM1Ng&ixlib=rb-1.2.1&q=80&w=300',
    'https://images.unsplash.com/photo-1626705106454-e87b87e7c1b2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ1NDM2Mg&ixlib=rb-1.2.1&q=80&w=300']
]

module.exports = {
  one_section_array
}
