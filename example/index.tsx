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

const Test: FC = () => {
  return <div style={{ height: 200, border: '1px solid red' }}>342342</div>
}

const Demo = () => {
  console.log(32344)

  return (
    <div style={{ height: '100vh' }}>
      <VirtualList listData={createListData(200)} itemSize={200}>
        <Test />
      </VirtualList>
    </div>
  )
}

render(<Demo />, document.getElementById('app'))
