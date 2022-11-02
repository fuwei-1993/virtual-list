import { VirtualListItem } from '@components/virtual-list-item'
import { useCrossRendering } from '@hooks/use-cross-rendering'
import { useSize } from '@hooks/use-size'
import './index.less'

type Position = {
  bottom: number
  height: number
  index: number
}

export type Children<T> = React.ReactElement | ((itemData: T) => JSX.Element)
interface VirtualListProps<T> {
  /** @prop {{ any }[]} 列表数据 */
  listData?: T[]

  /** @prop {boolean} [dynamicHeight = false] 是否动态计算高度 */
  dynamicHeight?: boolean

  /** @prop {number} [debounce = 500] 计算高度时是否防抖 */
  debounce?: number

  /** @prop {number} 滚动区域高度默认是容器高度 */
  screenHeight?: number

  // /** @prop {number} [itemSize = 200] 滚动列表项的高度 */
  // itemSize?: number

  /** @prop {number}  子节点是一个函数 或是 react node */
  children?: Children<T>

  /** @prop {number} [estimatedItemSize = 200] 滚动列表项的高度 */
  estimatedItemSize?: number

  /** @prop {number} [scrollTo = 0] 支持传入滚动 */
  scrollTo?: number
}

function VirtualList<T>({
  listData,
  children,
  dynamicHeight = false,
  debounce = 0,
  screenHeight,
  // itemSize,
  scrollTo = 0,
  estimatedItemSize = 200,
}: VirtualListProps<T>) {
  const vContainer = useRef<HTMLDivElement>(null)
  const { height } = useSize(vContainer, !dynamicHeight, debounce)
  const [scrollTop, setScrollTop] = useState(0)
  const [positions, setPositions] = useState<Partial<Position>[]>([])
  const listRef = useRef<HTMLDivElement>(null)
  const innerScreenHeight = screenHeight || height

  useCrossRendering(vContainer, listRef, listData)

  useEffect(() => {
    vContainer.current?.scrollTo({ top: scrollTo })
  }, [scrollTo])

  const onVirtualListScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(event.currentTarget.scrollTop)
    },
    [],
  )

  const initPositions = useCallback(() => {
    const positions =
      listData?.map((_, index) => ({
        height: estimatedItemSize,
        bottom: (index + 1) * estimatedItemSize,
        index,
      })) ?? []

    setPositions(positions)
  }, [listData, estimatedItemSize])

  const binarySearch = useCallback(
    (positions: Position[], scrollTop: number) => {
      if (scrollTop === 0) return 0

      let start = 0
      let end = positions.length - 1

      while (start + 1 < end) {
        const middle = Math.floor((start + end) / 2)
        if (scrollTop > positions[middle].bottom) {
          start = middle + 1
        } else {
          end = middle - 1
        }
      }

      return end
    },
    [],
  )

  const updateItemSize = useCallback(() => {
    const itemNodes = Array.from(
      listRef.current?.children ?? [],
    ) as HTMLDivElement[]

    setPositions(positions => {
      let currentPos = positions

      itemNodes.forEach(node => {
        const index = Number(node.dataset.id)
        const height = node.getBoundingClientRect().height
        const oldHeight = currentPos[index]?.height ?? 0
        const diffHeight = height - oldHeight

        if (diffHeight && currentPos[index]?.bottom) {
          currentPos = [...currentPos]
          currentPos[index].bottom =
            diffHeight + (currentPos[index]?.bottom ?? 0)
          currentPos[index].height = height

          for (let k = index + 1; k < currentPos.length; k++) {
            currentPos[k].bottom = diffHeight + (currentPos[k]?.bottom ?? 0)
          }
        }
      })
      return currentPos
    })
  }, [])

  const totalHeight = useMemo(
    () => positions[positions.length - 1]?.bottom ?? 0,
    [positions],
  )
  const totalCount = useMemo(() => {
    return Math.ceil(innerScreenHeight / estimatedItemSize)
  }, [innerScreenHeight, estimatedItemSize])

  const startIndex = useMemo(() => {
    const startPositionIndex = binarySearch(positions as Position[], scrollTop)

    return startPositionIndex >= 0 ? startPositionIndex : positions.length - 1
  }, [scrollTop, positions, binarySearch])

  const endIndex = useMemo(
    () => totalCount + startIndex,
    [totalCount, startIndex],
  )

  const offsetTop = useMemo(() => {
    if (!startIndex) return 0

    return positions[startIndex - 1]?.bottom ?? 0
  }, [positions, startIndex])

  const vList = useMemo(() => {
    return listData
      ?.map((item, index) => ({ item, index }))
      .slice(startIndex, endIndex + 3)
  }, [startIndex, endIndex, listData])

  const renderItem = useMemo(() => {
    return (
      <>
        {vList?.map(({ item, index }, i) => {
          return (
            <VirtualListItem key={i} id={index} itemData={item}>
              {children}
            </VirtualListItem>
          )
        })}
      </>
    )
  }, [vList, children])

  const isNeedUpdateItemSize = useMemo(
    () => Math.floor(scrollTop / innerScreenHeight),
    [innerScreenHeight, scrollTop],
  )

  useEffect(() => {
    initPositions()
  }, [initPositions])

  useEffect(() => {
    updateItemSize()
  }, [updateItemSize, isNeedUpdateItemSize, initPositions])

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
          transform: `translate3d(0,${offsetTop}px,0)`,
        }}
        ref={listRef}
      >
        {renderItem}
      </div>
    </div>
  )
}

export default memo(VirtualList) as typeof VirtualList
