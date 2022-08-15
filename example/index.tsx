import { FC } from 'react'
import { render } from 'react-dom'
import { VirtualList } from '../src'

const createListData = (len: number) => {
  const result = []
  for (let index = 0; index < len; index++) {
    result.push({ id: index })
  }

  return result
}

const Test: FC<{ list: any[] }> = ({ list }) => {
  return (
    <>
      {list.map((item, index) => {
        return (
          <div style={{ height: 200, border: '1px solid red' }} key={index}>
            {item.id}
          </div>
        )
      })}
    </>
  )
}

const Demo = () => {
  return (
    <div style={{ height: '100vh' }}>
      <VirtualList listData={createListData(200)} itemSize={200}>
        {list => {
          return <Test list={list} />
        }}
      </VirtualList>
    </div>
  )
}

render(<Demo />, document.getElementById('app'))
