import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import Modal from '../modal/modal'
import rootReducer from '../../reducers/root_reducer'

const createMockStore = (preloadedState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  })

const renderModal = (modal: string | null, closeModal = vi.fn()) => {
  const store = createMockStore({
    session: { isAuthenticated: false, user: null },
    errors: { session: [] },
  })

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Modal modal={modal} closeModal={closeModal} />
      </MemoryRouter>
    </Provider>
  )
}

describe('Modal', () => {
  it('renders nothing when modal is null', () => {
    const { container } = renderModal(null)

    expect(container.firstChild).toBeNull()
  })

  it('renders the modal background when modal is provided', () => {
    const { container } = renderModal('login')

    expect(container.querySelector('.modal-background')).toBeInTheDocument()
  })

  it('renders modal content wrapper', () => {
    const { container } = renderModal('login')

    expect(container.querySelector('.modal-content')).toBeInTheDocument()
  })

  it('calls closeModal when clicking background', () => {
    const closeModal = vi.fn()
    const { container } = renderModal('login', closeModal)

    const background = container.querySelector('.modal-background')
    if (background) {
      fireEvent.click(background)
    }

    expect(closeModal).toHaveBeenCalled()
  })

  it('does not call closeModal when clicking modal content', () => {
    const closeModal = vi.fn()
    const { container } = renderModal('login', closeModal)

    const content = container.querySelector('.modal-content')
    if (content) {
      fireEvent.click(content)
    }

    expect(closeModal).not.toHaveBeenCalled()
  })
})
