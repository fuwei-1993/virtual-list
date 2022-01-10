import { useSize } from '@hooks/use-size'
import { FC, memo, useRef } from 'react'
import './index.less'
interface VirtualListProps {
  /** @prop {{ id: string | number }[]} 列表数据 */
  listData: { id: string | number }[]

  /** @prop {boolean} [once = true] 是否只计算一次高度 */
  once?: boolean

  /** @prop {number} [debounce = 500] 是否防抖 */
  debounce?: number
}

const VirtualList: FC<VirtualListProps> = memo(
  ({ listData, children, once = true, debounce = 500 }) => {
    const vContainer = useRef<HTMLDivElement>(null)
    const { height } = useSize(vContainer, once, debounce)

    return (
      <div className="virtual-list-container" ref={vContainer}>
        <div className="virtual-list-phantom"></div>
        <div className="virtual-list">{children}</div>
      </div>
    )
  },
)

VirtualList.displayName = 'virtual-list'

export default VirtualList
