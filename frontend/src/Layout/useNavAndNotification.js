import { useReducer, useEffect, useCallback } from 'react';

// Initial state for the reducer
const initialState = {
  isNavVisible: false,
  butIsNavVisible: false,
  isNotificationsVisible: false,
  butIsNotificationsVisible: false,
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_NAV':
      return {
        ...state,
        isNavVisible: true,
        butIsNotificationsVisible: action.butIsNotificationsVisible ?? state.butIsNotificationsVisible,
      };
    case 'HIDE_NAV':
      return {
        ...state,
        isNavVisible: false,
        butIsNotificationsVisible: action.butIsNotificationsVisible ?? state.butIsNotificationsVisible,
      };
    case 'TOGGLE_NAV':
      return {
        ...state,
        isNavVisible: !state.isNavVisible,
        butIsNavVisible: !state.butIsNavVisible,
      };
    case 'SHOW_NOTIFICATIONS':
      return {
        ...state,
        isNotificationsVisible: true,
        butIsNavVisible: action.butIsNavVisible ?? state.butIsNavVisible,
      };
    case 'HIDE_NOTIFICATIONS':
      return {
        ...state,
        isNotificationsVisible: false,
        butIsNavVisible: action.butIsNavVisible ?? state.butIsNavVisible,
      };
    case 'TOGGLE_NOTIFICATIONS':
      return {
        ...state,
        isNotificationsVisible: !state.isNotificationsVisible,
        butIsNotificationsVisible: !state.butIsNotificationsVisible,
      };
    default:
      return state;
  }
};

// Custom hook for managing navigation and notifications
export const useNavAndNotification = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1200) {
      // Show both nav and notifications on larger screens
      dispatch({ type: 'SHOW_NAV' });
      dispatch({ type: 'SHOW_NOTIFICATIONS' });
    } else if (width >= 600) {
      // For tablet screens, show nav by default but hide notifications
      dispatch({ type: 'SHOW_NAV' });
      dispatch({ type: 'HIDE_NOTIFICATIONS' });
    } else {
      // For smaller screens, hide both nav and notifications by default
      dispatch({ type: 'HIDE_NAV' });
      dispatch({ type: 'HIDE_NOTIFICATIONS' });
    }
  }, []);

  useEffect(() => {
    // Set initial state based on window size
    handleResize();

    // Add the resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  const toggleNav = () => {
    dispatch({ type: 'TOGGLE_NAV' });
  };

  const toggleNotifications = () => {
    dispatch({ type: 'TOGGLE_NOTIFICATIONS' });
  };

  return {
    state,
    toggleNav,
    toggleNotifications,
  };
};
