import { useIntersectionObserver } from './use-intersection-observer'

export const useCrossRendering = <T>(
  root: React.MutableRefObject<HTMLDivElement | null>,
  list?: React.MutableRefObject<HTMLDivElement | null>,
  listData?: T[],
) => {
  const changesHandler = useCallback(changes => {
    for (const change of changes) {
      console.log(change.time)
      // Timestamp when the change occurred
      // 当可视状态变化时，状态发送改变的时间戳
      // 对比时间为，实例化的时间，
      // 比如，值为1000时，表示在IntersectionObserver实例化的1秒钟之后，触发该元素的可视性变化

      console.log(change.rootBounds)
      // Unclipped area of root
      // 根元素的矩形区域信息，即为getBoundingClientRect方法返回的值

      console.log(change.boundingClientRect)
      // target.boundingClientRect()
      // 目标元素的矩形区域的信息

      console.log(change.intersectionRect)
      // boundingClientRect, clipped by its containing block ancestors,
      // and intersected with rootBounds
      // 目标元素与视口（或根元素）的交叉区域的信息

      console.log(change.intersectionRatio)
      // Ratio of intersectionRect area to boundingClientRect area
      // 目标元素的可见比例，即intersectionRect占boundingClientRect的比例，
      // 完全可见时为1，完全不可见时小于等于0

      console.log(change.target)
      // the Element target
      // 被观察的目标元素，是一个 DOM 节点对象
      // 当前可视区域正在变化的元素
    }
  }, [])

  const { observer } = useIntersectionObserver(root, changesHandler)

  useEffect(() => {
    // Watch for intersection events on a specific target Element.
    // 对元素target添加监听，当target元素变化时，就会触发上述的回调

    const itemNodes = Array.from(
      list?.current?.children ?? [],
    ) as HTMLDivElement[]

    itemNodes.forEach(node => {
      observer.observe(node)
    })
  }, [list, observer, listData])
}
