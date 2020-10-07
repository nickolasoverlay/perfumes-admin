import * as actions from './../actions'

const initialState = {
  isLoggedIn: false,
  isRoot: false,
  canAddAdmins: false,
  canDeleteAdmins: false,
  canAddCategories: false,
  canDeleteCategories: false,
  canAddItems: false,
  canDeleteItems: false,
  name: '',
  login: '',
}

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOG_IN:
      console.log('LOG_IN', action.payload)
      return {
        ...state,
        isLoggedIn: true,
        isRoot: action.payload.root,
        canAddAdmins: action.payload.can_add_admins,
        canDeleteAdmins: action.payload.can_delete_admins,
        canAddCategories: action.payload.can_add_categories,
        canDeleteCategories: action.payload.can_delete_categories,
        canAddItems: action.payload.can_add_items,
        canDeleteItems: action.payload.can_delete_items,
        name: action.payload.name,
        login: action.payload.login,
      }

    case actions.LOG_OUT:
      return {
        ...state,
        ...initialState
      }
    default:
      return state
  }
}