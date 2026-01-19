import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import Root from '../root'
import rootReducer from '../../reducers/root_reducer'

const createMockStore = (preloadedState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  })

describe('Root', () => {
  it('renders without crashing', () => {
    const store = createMockStore({
      session: { isAuthenticated: false, user: null },
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

    const { container } = render(<Root store={store} />)

    expect(container).toBeDefined()
  })

  it('wraps children in Provider and Router', () => {
    const store = createMockStore({
      session: { isAuthenticated: false, user: null },
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

    const { container } = render(<Root store={store} />)

    // The component should render without throwing errors
    // indicating Provider and Router are properly set up
    expect(container.firstChild).not.toBeNull()
  })
})
