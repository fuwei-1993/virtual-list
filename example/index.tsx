import { FC } from 'react'
import { render } from 'react-dom'
import { VirtualList } from '../src'

const createListData = (len: number) => {
  const result = []
  for (let index = 0; index < len; index++) {
    result.push({
      id: index,
      style: { height: Math.random() * 300 + 60, border: '1px solid red' },
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
      <VirtualList listData={createListData(200)} itemSize={200}>
        <Test />
      </VirtualList>
    </div>
  )
}

const Demo2 = () => {
  return (
    <div style={{ height: '100vh' }}>
      <VirtualList listData={createListData(200)} itemSize={200}>
        {itemData => {
          return <Test itemData={itemData} />
        }}
      </VirtualList>
    </div>
  )
}

render(<Demo2 />, document.getElementById('app'))
