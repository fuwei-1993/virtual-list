export const useIntersectionObserver = (
  root: React.MutableRefObject<HTMLDivElement | null>,
  changesHandler: (changes: IntersectionObserverEntry[]) => void,
) => {
  const observer = useMemo(() => {
    const innerObserver = new IntersectionObserver(changesHandler, {
      root: root.current,
    })
    return innerObserver
  }, [root, changesHandler])

  useEffect(() => {
    return () => {
      observer.disconnect()
    }
  }, [observer])

  return {
    observer,
  }
}
