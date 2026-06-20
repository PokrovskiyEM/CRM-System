import { describe, expect, test } from 'vitest'
import { isStatusFilter } from './isStatusFilter'

describe('isStatusFilter', () => {
  test('передан верный фильтр', () => {
    expect(isStatusFilter('all')).toBeTruthy()
  })

  test('передан неверный фильтр', () => {
    expect(isStatusFilter('inProgress')).toBeFalsy()
  })
})