import debounce from 'lodash/debounce'

export const useSize = <T extends HTMLElement | null>(
  elementRef: React.MutableRefObject<T>,
  once = true,
  debounceTime = 500,
) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const handleResize = useCallback(
    debounce(() => {
      const height = elementRef.current?.clientHeight ?? 0
      const width = elementRef.current?.clientWidth ?? 0

      height >= 0 && setHeight(height)
      width >= 0 && setWidth(width)
    }, debounceTime),
    [debounceTime],
  )

  useEffect(() => {
    handleResize()
  }, [handleResize])

  useEffect(() => {
    if (!once) {
      window.addEventListener('resize', handleResize)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize, once])

  return {
    width,
    height,
  }
}
