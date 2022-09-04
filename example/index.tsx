import { FC } from 'react'
import { render } from 'react-dom'
import { VirtualList } from '../src'

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
  return <div style={style}>{id}他们说这就是人生</div>
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
