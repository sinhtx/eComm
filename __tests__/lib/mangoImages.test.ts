import {
  preferVarietyPhoto,
  varietyImageAlt,
  varietyPhotoUrl,
  varietySvgFallback,
  varietySvgUrl,
} from '@/lib/mangoImages'

describe('variety image paths', () => {
  it('uses a jpg for each named variety', () => {
    expect(varietyPhotoUrl('Carrie')).toBe('/images/mangoes/carrie.jpg')
    expect(varietyPhotoUrl('Nam Dok Mai')).toBe('/images/mangoes/nam-dok-mai.jpg')
    expect(varietyPhotoUrl('Tommy Atkins')).toBe('/images/mangoes/tommy-atkins.jpg')
  })

  it('maps the Frorigan typo to the Florigon photo', () => {
    expect(varietyPhotoUrl('Frorigan')).toBe('/images/mangoes/florigon.jpg')
    expect(varietyPhotoUrl('frorigan')).toBe('/images/mangoes/florigon.jpg')
    expect(preferVarietyPhoto('/images/mangoes/frorigan.svg')).toBe(
      '/images/mangoes/florigon.jpg'
    )
    expect(varietySvgUrl('Frorigan')).toBe('/images/mangoes/florigon.svg')
    expect(varietyImageAlt('Frorigan')).toBe('Florigon mango')
  })

  it('keeps the svg as the jpg fallback and leaves mix-box art alone', () => {
    expect(varietySvgFallback('/images/mangoes/kent.jpg')).toBe(
      '/images/mangoes/kent.svg'
    )
    expect(preferVarietyPhoto('/images/mangoes/mix-box-small.svg')).toBe(
      '/images/mangoes/mix-box-small.svg'
    )
  })

  it('builds alt text from the variety name', () => {
    expect(varietyImageAlt('Haden')).toBe('Haden mango')
    expect(varietyImageAlt('Nam Dok Mai')).toBe('Nam Dok Mai mango')
  })
})
