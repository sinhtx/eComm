import { render, screen, waitFor } from '@testing-library/react'
import { MangoVarietyGrid } from '@/components/MangoVarietyGrid'

describe('MangoVarietyGrid', () => {
  test('displays available mangoes from data', async () => {
    render(<MangoVarietyGrid onSelectMango={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText('Carrie')).toBeInTheDocument()
    })
    expect(screen.getByText('Mallika')).toBeInTheDocument()
    expect(screen.getByText('Kent')).toBeInTheDocument()
  })

  test('does not display unavailable mangoes', async () => {
    render(<MangoVarietyGrid onSelectMango={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText('Carrie')).toBeInTheDocument()
    })
    // Francis is not in storefront fallback / available set
    expect(screen.queryByText('Francis')).not.toBeInTheDocument()
  })

  test('calls onSelectMango when card is clicked', async () => {
    const onSelectMango = jest.fn()
    render(<MangoVarietyGrid onSelectMango={onSelectMango} />)

    const carrieButton = await screen.findByRole('button', { name: /carrie/i })
    carrieButton.click()

    expect(onSelectMango).toHaveBeenCalled()
  })

  test('displays multiple mango cards in grid', async () => {
    render(<MangoVarietyGrid onSelectMango={() => {}} />)

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(5)
    })
  })
})
