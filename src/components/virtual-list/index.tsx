import { useSize } from '@hooks/use-size'
import { FC, ReactElement, isValidElement } from 'react'
import './index.less'

type ItemData = { id: string | number }
type Positions = {
  bottom: number
  height: number
  index: number
}
interface VirtualListProps<T> {
  /** @prop {{ id: string | number }[]} 列表数据 */
  listData?: T[]

  /** @prop {boolean} [once = true] 是否只计算一次高度 */
  dynamicHeight?: boolean

  /** @prop {number} [debounce = 500] 是否防抖 */
  debounce?: number

  /** @prop {number} 滚动区域高度默认是容器高度 */
  screenHeight?: number

  // /** @prop {number} [itemSize = 200] 滚动列表项的高度 */
  // itemSize?: number

  /** @prop {number}  子节点是一个函数 或是 react node */
  children?: ReactElement | ((itemData: T) => JSX.Element)

  /** @prop {number} [estimatedItemSize = 200] 滚动列表项的高度 */
  estimatedItemSize?: number
}

function VirtualList<T extends ItemData = ItemData>({
  listData,
  children,
  dynamicHeight = false,
  debounce = 0,
  screenHeight,
  // itemSize,
  estimatedItemSize = 200,
}: VirtualListProps<T>) {
  const vContainer = useRef<HTMLDivElement>(null)
  const { height } = useSize(vContainer, !dynamicHeight, debounce)
  const [scrollTop, setScrollTop] = useState(0)
  const [positions, setPositions] = useState<Partial<Positions>[]>([])
  const listRef = useRef<HTMLDivElement>(null)
  const innerScreenHeight = screenHeight || height

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
    // TODO ..
    const startPositionIndex = positions.findIndex(
      p => (p?.bottom ?? 0) >= scrollTop,
    )
    return startPositionIndex >= 0 ? startPositionIndex : positions.length - 1
  }, [scrollTop, positions])

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

  const handleChildren = useCallback(
    (itemData: T) => {
      if (isValidElement(children)) {
        return cloneElement(children, {
          itemData,
          ...children.props,
        })
      }
      return children?.(itemData)
    },
    [children],
  )

  const renderItem = useMemo(() => {
    return (
      <>
        {vList?.map(({ item, index }, i) => {
          return (
            <div key={i} data-id={index} className="virtual-list-item">
              {handleChildren(item)}
            </div>
          )
        })}
      </>
    )
  }, [handleChildren, vList])

  const isNeedUpdateItemSize = useMemo(
    () => Math.floor(scrollTop / innerScreenHeight),
    [innerScreenHeight, scrollTop],
  )

  useEffect(() => {
    initPositions()
  }, [initPositions])

  useEffect(() => {
    updateItemSize()
  }, [updateItemSize, isNeedUpdateItemSize])

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
}

export default VirtualList
