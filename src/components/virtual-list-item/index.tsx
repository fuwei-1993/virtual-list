import { Children } from '@components/virtual-list'

interface VirtualListItem<T> {
  children?: Children<T>
  itemData: T
}

export function VirtualListItem<T>({ children, itemData }: VirtualListItem<T>) {
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
  return <>{handleChildren(itemData)}</>
}
