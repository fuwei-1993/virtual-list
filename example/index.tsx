import React from 'react'
import { render } from 'react-dom'
import { VirtualList } from '../src'

const Demo = () => {
  return <VirtualList listData={[]} />
}

render(<Demo />, document.getElementById('app'))
