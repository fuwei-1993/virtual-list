import { Children } from '@components/virtual-list'

interface VirtualListItem<T> {
  children?: Children<T>
  itemData: T
  id: string | number
}

export function VirtualListItem<T>({
  children,
  id,
  itemData,
}: VirtualListItem<T>) {
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
  return (
    <div data-id={id} className="virtual-list-item">
      {handleChildren(itemData)}
    </div>
  )
}
