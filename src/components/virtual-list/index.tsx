import { useSize } from '@hooks/use-size'
import type { FC, ReactNode } from 'react'
import './index.less'

type ListData = { id: string | number }[]
type Positions = {
  top: number
  bottom: number
  height: number
  index: number
}
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

  /** @prop {number}  子节点是一个函数 或是 react node */
  children: ReactNode | ((list: ListData) => ReactNode)
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
    const [positions, setPositions] = useState<Partial<Positions>[]>([])
    const listRef = useRef<HTMLDivElement>(null)
    const [estimatedItemSize, setEstimatedItemSize] = useState(itemSize)
    const innerScreenHeight = screenHeight || height

    const onVirtualListScroll = (event: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(event.currentTarget.scrollTop)
    }

    const initPositions = useCallback(() => {
      const positions = listData.map((_, index) => ({
        height: estimatedItemSize,
        top: index * estimatedItemSize,
        bottom: (index + 1) * estimatedItemSize,
        index,
      }))

      setPositions(positions)
    }, [listData, estimatedItemSize])

    const totalHeight = useMemo(
      () => positions[positions.length - 1]?.bottom ?? 0 * estimatedItemSize,
      [positions, estimatedItemSize],
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
      const interStartIndex = startIndex - 3
      return listData
        .map((item, index) => ({ item, index }))
        .slice(Math.max(interStartIndex, 0), endIndex + 3)
    }, [startIndex, endIndex, listData])

    const renderItem = useMemo(() => {
      return (
        <>
          {vList.map(({ item, index }, i) => {
            return (
              <div key={i} data-id={index} className="virtual-list-item">
                {children}
              </div>
            )
          })}
        </>
      )
    }, [children, vList])

    useEffect(() => {
      initPositions()
    }, [initPositions])

    useEffect(() => {
      const itemNodes = Array.from(
        listRef.current?.children ?? [],
      ) as HTMLDivElement[]

      itemNodes.forEach(node => {
        const index = Number(node.dataset.id)
        const height = node.getBoundingClientRect().height
        const oldHeight = positions[index]?.height ?? 0
        const diffHeight = height - oldHeight

        if (diffHeight) {
        }
      })
      console.log()
    }, [positions])

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
          ref={listRef}
        >
          {renderItem}
        </div>
      </div>
    )
  },
)

export default VirtualList
