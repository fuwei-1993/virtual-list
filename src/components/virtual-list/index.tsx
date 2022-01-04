import { FC, memo } from 'react'
import './index.less'
interface VirtualListProps {
  listData: { id: string | number }[]
}

const VirtualList: FC<VirtualListProps> = memo(({ listData, children }) => {
  return (
    <div className="virtual-list-container">
      <div className="virtual-list-phantom"></div>
      <div className="virtual-list">{children}</div>
    </div>
  )
})

VirtualList.displayName = 'virtual-list'

export default VirtualList
