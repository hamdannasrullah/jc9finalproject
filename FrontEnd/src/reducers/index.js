import { combineReducers } from 'redux'

const init = {
    id: '',
    username: '',
    error: '',
    success: '',
    empty: '',
    role:'',
    quantity:0,
    notification: []
}

const AuthReducer = (state=init, action) => {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        return {...state, id: action.payload.id, username: action.payload.username, role:action.payload.role, notification:action.payload.notification}
      case 'AUTH_ERROR':
        return { ...state, error: action.payload, success: '', empty: '' }
      case 'REGISTER_SUCCESS':
        return { ...state, error: '', success: action.payload }
      case 'AFTER_ERROR':
        return { ...state, error: '', empty: '' }
      case 'AUTH_EMPTY':
        return { ...state, error: '', empty: action.payload }
      case 'LOGOUT_USER':
        return { ...state, id: '', username: '', role:''}
      case 'ADD_SUCCES':
        return { ...state, success: action.payload }
      case 'KEEP_LOGIN':
        return {...state, id: action.payload.id, username: action.payload.username, role:action.payload.role}
      case 'EDIT_SUCCESS':
          return {...state, id: action.payload.id, username: action.payload.username, role: action.payload.role}
      case 'ADD_CART':
          return{...state, quantity:action.payload.quantity}
      case 'GET_NOTIF':
          return{...state, notification:action.payload.notification}
      default:
        return state
    }
}

export default combineReducers(
    {
        auth: AuthReducer
    }
)