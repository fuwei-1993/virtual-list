# fuwei-virtaul-list
一个基于react的虚拟滚动组件
### 最近更新
- 0.0.6 - 删除了item dom提升渲染性能

- 0.0.5 - 优化滚动计算性能

- 0.0.4 - 增加滚动位置参数 & list data 变化重新计算

- 0.0.3 - 增加keywords

- 0.0.2 - 增加说明文档

- 0.0.1 - 发布组件第一版

### 安装

```
$ yarn add fuwei-virtual-list
or
$ npm i fuwei-virtual-list
```

### Notice

本组件依赖于react

### API

| 名称 | 描述 | 类型 | 默认值 | 备注 |
| :-- | :-- | :-- | :-- | :-- |
| listData? | 列表数据 | any[] | - | 数据列表 |
| estimatedItemSize?: | 预估高度         | number | - | item的预估高度，可以是平均值 |
| dynamicHeight? | 是否动态计算高度 | boolean                                   | False | 动态计算高度使用在可以手动拖拽容器的场景 |
| debounce? | 防抖 | number | 0 | 动态计算高度时的防抖时间 |
| screenHeight? | 容器高度 | number | - |容器可以是固定高度|
| screenTo? | 滚动位置 | number | - |传入滚动位置|
| children? | 子节点 | ReactElement \|((itemData:) => JSX.Element) | - |子节点可以是函数也可以是组件|


### 使用示例

```tsx
import { FC } from 'react'
import { render } from 'react-dom'
import { VirtualList } from 'fuwei-virtual-list'

const createListData = (len: number) => {
  const result = []
  for (let index = 0; index < len; index++) {
    result.push({
      id: index,
      style: { height: Math.random() * 50 + 60, border: '1px solid red' },
    })
  }

  return result
}

const Test: FC<any> = ({ itemData: { style, id } }) => {
  return <div style={style}>{id}asdasdadasdas</div>
}

const Demo = () => {
  return (
    <div style={{ height: '100vh' }}>
      <VirtualList listData={createListData(2000)} estimatedItemSize={85}>
        <Test />
      </VirtualList>
    </div>
  )
}

const Demo2 = () => {
  return (
    <div style={{ height: '100vh' }}>
      <VirtualList listData={createListData(20000)} estimatedItemSize={85}>
        {itemData => {
          return <Test itemData={itemData} />
        }}
      </VirtualList>
    </div>
  )
}

render(<Demo2 />, document.getElementById('app'))
```



