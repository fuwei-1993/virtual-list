import { useSize } from '@hooks/use-size'
import type { FC, ReactNode } from 'react'
import './index.less'

type ListData = { id: string | number }[]
interface VirtualListProps {
  /** @prop {{ id: string | number }[]} 列表数据 */
  listData: ListData

  /** @prop {boolean} [once = true] 是否只计算一次高度 */
  once?: boolean

  /** @prop {number} [debounce = 500] 是否防抖 */
  debounce?: number

  /** @prop {number} 滚动区域高度默认是容器高度 */
  screenHeight?: number

  /** @prop {number} [itemSize = 200] 滚动列表项的高度 */
  itemSize: number

  /** @prop {number}  子节点是一个函数 */
  children: (list: ListData) => ReactNode
}

const VirtualList: FC<VirtualListProps> = memo(
  ({
    listData,
    children,
    once = true,
    debounce = 500,
    screenHeight,
    itemSize,
  }) => {
    const vContainer = useRef<HTMLDivElement>(null)
    const { height } = useSize(vContainer, once, debounce)
    const [scrollTop, setScrollTop] = useState(0)
    const innerScreenHeight = screenHeight || height

    const onVirtualListScroll = (event: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(event.currentTarget.scrollTop)
    }

    const totalHeight = useMemo(
      () => itemSize * listData.length,
      [itemSize, listData.length],
    )
    const totalCount = useMemo(() => {
      return Math.ceil(innerScreenHeight / itemSize)
    }, [innerScreenHeight, itemSize])

    const startIndex = useMemo(() => {
      return Math.floor(scrollTop / itemSize)
    }, [scrollTop, itemSize])

    const endIndex = useMemo(
      () => totalCount + startIndex,
      [totalCount, startIndex],
    )

    const offsetTop = useMemo(
      () => scrollTop - (scrollTop % itemSize),
      [scrollTop, itemSize],
    )

    const vList = useMemo(() => {
      const interStartIndex = startIndex - 2 < 0 ? startIndex : startIndex - 2
      return listData.slice(interStartIndex, endIndex + 2)
    }, [startIndex, endIndex, listData])

    return (
      <div
        className="virtual-list-container"
        onScroll={onVirtualListScroll}
        ref={vContainer}
      >
        <div
          style={{ height: totalHeight }}
          className="virtual-list-phantom"
        ></div>
        <div
          className="virtual-list"
          style={{
            transform: `translateY(${offsetTop}px)`,
          }}
        >
          {children?.(vList)}
        </div>
      </div>
    )
  },
)

export default VirtualList
