import { useState, useEffect, MutableRefObject } from 'react'
import debounce from 'lodash/debounce'

export const useSize = <T extends HTMLElement | null>(
  elementRef: MutableRefObject<T>,
  once = false,
  debounceTime = 500,
) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const handleResize = debounce(() => {
    const height = elementRef.current?.clientHeight ?? 0
    const width = elementRef.current?.clientWidth ?? 0

    height >= 0 && setHeight(height)
    width >= 0 && setWidth(width)
  }, debounceTime)

  useEffect(() => {
    handleResize()
  }, [elementRef])

  useEffect(() => {
    if (!once) {
      window.addEventListener('resize', handleResize)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [elementRef])

  return {
    width,
    height,
  }
}
