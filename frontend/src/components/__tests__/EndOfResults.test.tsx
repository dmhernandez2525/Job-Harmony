import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EndOfResults from '../browse/end_of_results'

describe('EndOfResults', () => {
  it('renders the end of results message', () => {
    render(<EndOfResults />)

    expect(screen.getByText("You've reached the end of your results.")).toBeInTheDocument()
  })

  it('renders the check back message', () => {
    render(<EndOfResults />)

    expect(screen.getByText('Check back soon for new opportunites!')).toBeInTheDocument()
  })

  it('has the correct container class', () => {
    const { container } = render(<EndOfResults />)

    expect(container.querySelector('.onepage-detail-container')).toBeInTheDocument()
    expect(container.querySelector('.no-more-results')).toBeInTheDocument()
  })
})
