export const useIntersectionObserver = (
  root: React.MutableRefObject<HTMLDivElement | null>,
  changesHandler: (changes: IntersectionObserverEntry[]) => void,
) => {
  const observer = useMemo(() => {
    //初始化一个实例
    const innerObserver = new IntersectionObserver(changesHandler, {
      root: root.current,
    })
    return innerObserver
  }, [root, changesHandler])

  useEffect(() => {
    // Watch for intersection events on a specific target Element.
    // 对元素target添加监听，当target元素变化时，就会触发上述的回调

    return () => {
      // Stop watching for intersection events on a specific target Element.
      // 移除一个监听，移除之后，target元素的可视区域变化，将不再触发前面的回调函数
      // observer.unobserve(dom)
      // Stop observing threshold events on all target elements.
      // 停止所有的监听
      observer.disconnect()
    }
  }, [observer])

  return {
    observer,
  }
}
