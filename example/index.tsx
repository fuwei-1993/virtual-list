import { FC } from 'react'
import { render } from 'react-dom'
import { VirtualList } from '../src'

const createListData = (len: number, random = 50) => {
  const result = []
  for (let index = 0; index < len; index++) {
    result.push({
      id: index,
      style: { height: Math.random() * random + 60, border: '1px solid red' },
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
  const [data, setData] = useState<ReturnType<typeof createListData>>([])

  useEffect(() => {
    setTimeout(() => {
      setData(createListData(20000, Math.random() * 50))
    }, 1000)
  }, [])
  return (
    <>
      <button
        onClick={() => {
          setData(createListData(20000 * Math.random(), Math.random() * 50))
        }}
      >
        点我
      </button>
      <div style={{ height: '500px' }}>
        <VirtualList listData={data} dynamicHeight estimatedItemSize={15}>
          {itemData => {
            return <Test itemData={itemData} />
          }}
        </VirtualList>
      </div>
    </>
  )
}

render(<Demo2 />, document.getElementById('app'))
