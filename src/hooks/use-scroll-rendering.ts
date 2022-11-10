type Position = {
  bottom: number
  height: number
  index: number
}

export const useScrollRendering = <T>(
  estimatedItemSize: number,
  listRef: React.MutableRefObject<HTMLDivElement | null>,
  innerScreenHeight: number,
  listData?: T[],
) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [positions, setPositions] = useState<Position[]>([])
  const virtualIndexMap = useRef<Record<number, number>>({})

  const onVirtualListScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(event.currentTarget.scrollTop)
    },
    [],
  )

  const initPositions = useMemo(() => {
    return (
      listData?.map((_, index) => ({
        height: estimatedItemSize,
        bottom: (index + 1) * estimatedItemSize,
        index,
      })) ?? []
    )
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

      return positions[start].bottom > scrollTop ? start : end
    },
    [],
  )

  const updateItemSize = useCallback(() => {
    if (!initPositions.length) return
    const itemNodes = Array.from(
      listRef.current?.children ?? [],
    ) as HTMLDivElement[]

    let currentPos = initPositions

    itemNodes.forEach((node, i) => {
      const index = virtualIndexMap.current[i]
      const height = node.getBoundingClientRect().height
      const oldHeight = currentPos[index].height
      const diffHeight = height - oldHeight

      if (diffHeight) {
        currentPos = [...currentPos]
        currentPos[index].bottom = diffHeight + currentPos[index].bottom
        currentPos[index].height = height

        for (let k = index + 1; k < currentPos.length; k++) {
          currentPos[k].bottom = diffHeight + currentPos[k].bottom
        }
      }
    })

    setPositions(currentPos)
  }, [listRef, initPositions])

  const totalHeight = useMemo(
    () => positions[positions.length - 1]?.bottom ?? 0,
    [positions],
  )
  const totalCount = useMemo(() => {
    return Math.ceil(innerScreenHeight / estimatedItemSize)
  }, [innerScreenHeight, estimatedItemSize])

  const startIndex = useMemo(() => {
    const startPositionIndex = binarySearch(positions, scrollTop)

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
    const result = listData
      ?.map((item, index) => ({ item, index }))
      .slice(startIndex, endIndex + 3)

    result?.forEach(({ index }, i) => {
      virtualIndexMap.current[i] = index
    })
    return result
  }, [startIndex, endIndex, listData])

  const isNeedUpdateItemSize = useMemo(() => {
    if (!innerScreenHeight) return 0
    return Math.floor(scrollTop / innerScreenHeight)
  }, [innerScreenHeight, scrollTop])

  useEffect(() => {
    updateItemSize()
  }, [updateItemSize, isNeedUpdateItemSize])

  return {
    onVirtualListScroll,
    totalHeight,
    offsetTop,
    vList,
  }
}
