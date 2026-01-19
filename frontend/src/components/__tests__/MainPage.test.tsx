import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import MainPage from '../main/main_page'
import rootReducer from '../../reducers/root_reducer'

const createMockStore = (preloadedState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  })

const renderMainPage = () => {
  const store = createMockStore({
    session: { isAuthenticated: true, user: { id: '1', role: 'JobSeeker' } },
    entities: {
      users: {},
      resumes: {},
      onePages: {},
      likes: {},
      preferences: {},
    },
    ui: {
      modal: null,
    },
    errors: {
      session: [],
    },
  })

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    </Provider>
  )
}

describe('MainPage', () => {
  it('renders the home page container', () => {
    const { container } = renderMainPage()

    expect(container.querySelector('.home-page-container')).toBeInTheDocument()
  })

  it('renders the browse buttons container', () => {
    const { container } = renderMainPage()

    expect(container.querySelector('.browse-buttons-container')).toBeInTheDocument()
  })
})
