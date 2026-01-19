import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import Buttons from '../buttons/buttons'
import rootReducer from '../../reducers/root_reducer'

const createMockStore = (preloadedState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  })

interface RenderButtonsOptions {
  user?: { role: string } | null
}

const renderButtons = ({ user = null }: RenderButtonsOptions = {}) => {
  const store = createMockStore({
    session: { isAuthenticated: !!user, user },
  })

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Buttons user={user} />
      </MemoryRouter>
    </Provider>
  )
}

describe('Buttons', () => {
  it('shows loading state when no user is provided', () => {
    renderButtons({ user: null })

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows employer buttons when user role is Employer', () => {
    renderButtons({ user: { role: 'Employer' } })

    expect(screen.getByText('Decline')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('shows job seeker buttons when user role is not Employer', () => {
    renderButtons({ user: { role: 'JobSeeker' } })

    expect(screen.getByText('Not Interested')).toBeInTheDocument()
    expect(screen.getByText('Interested')).toBeInTheDocument()
  })

  it('has the correct container class', () => {
    const { container } = renderButtons({ user: { role: 'JobSeeker' } })

    expect(container.querySelector('.buttons-container')).toBeInTheDocument()
  })

  it('renders two button containers', () => {
    const { container } = renderButtons({ user: { role: 'JobSeeker' } })

    expect(container.querySelector('.button-1')).toBeInTheDocument()
    expect(container.querySelector('.button-2')).toBeInTheDocument()
  })
})
