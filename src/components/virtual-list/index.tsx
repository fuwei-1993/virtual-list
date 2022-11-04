import { VirtualListItem } from '@components/virtual-list-item'
import { useCrossRendering } from '@hooks/use-cross-rendering'
import { useScrollRendering } from '@hooks/use-scroll-rendering'
import { useSize } from '@hooks/use-size'
import './index.less'

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

  const listRef = useRef<HTMLDivElement>(null)
  const innerScreenHeight = screenHeight || height

  // useCrossRendering(vContainer, listRef, listData)
  const { vList, offsetTop, totalHeight, onVirtualListScroll } =
    useScrollRendering(estimatedItemSize, listRef, innerScreenHeight, listData)

  useEffect(() => {
    vContainer.current?.scrollTo({ top: scrollTo })
  }, [scrollTo])

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
