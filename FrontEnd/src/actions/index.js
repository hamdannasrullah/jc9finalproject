import axios from '../config/axios'
import cookies from 'universal-cookie'
import Swal from 'sweetalert'

const cookie = new cookies()

export const onLoginClick = (username, password) => {
  return async dispatch => {
    await axios
      .post('/users/login', {
        username,
        password
      })
      .then(
        async res1 => {
          console.log(res1)

          await axios.get(`/user/notification/${res1.data.id}`).then(res => {
            cookie.set('idLogin', res1.data.id, { path: '/' })
            cookie.set('stillLogin', res1.data.username, { path: '/' })
            cookie.set('role', res1.data.role, { path: '/' })
            cookie.set('cartqty', res1.data.cart, { path: '/' })
            cookie.set('avatar', res1.data.avatar, { path: '/' })
            cookie.set('notification', res.data, { path: '/' })

            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                id: res1.data.id,
                username: res1.data.username,
                role: res1.data.role,
                quantity: res1.data.cart,
                notification: res.data
              }
            })
          })

        },
        err => {
          console.log(err)
          dispatch({
            type: 'AUTH_ERROR',
            payload: 'Username or Password incorrect'
          })
        }
      )
  }
}

export const getNotif = (userid) => {
  return async dispatch => {
    await axios
      .get(`/user/notification/${userid}`)
      .then(res =>{
            cookie.set('notification', res.data, { path: '/' })
            dispatch({
              type: 'GET_NOTIF',
              payload: {
                notification: res.data
              }
              })
        },
        err => {
          console.log(err)
          dispatch({
            type: 'AUTH_ERROR',
            payload: 'Username or Password incorrect'
          })
        }
      )
    }
  }

export const onLoginAdmin = (username, password) => {
  return async dispatch => {
    await axios
      .post('/admin/login', {
        username,
        password
      })
      .then(
        res => {
          cookie.set('stillLogin', res.data.username, { path: '/' })
          cookie.set('idLogin', res.data.id, { path: '/' })
          cookie.set('role', res.data.role, { path: '/' })

          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              id: res.data.id,
              username: res.data.username,
              role: res.data.role
            }
          })
        },
        err => {
          console.log(err.response)
          dispatch({
            type: 'AUTH_ERROR',
            payload: 'Username or Password incorrect!'
          })
        }
      )
  }
}

export const onRegister = (firstname,lastname,username,email,password,birthday,address,kodepos) => {
  return dispatch => {
    if (firstname === '' || lastname === '' || username === '' || password === '' || email === '') {
      dispatch({
        type: 'AUTH_EMPTY',
        payload: '* this form cannot be empty'
      })
    }else{
      axios.post('/user/register', {
        firstname,lastname,username,email,password,birthday,address,kodepos
        })
        .then(res => {
          console.log('Register Success')
          dispatch({
            type: 'REGISTER_SUCCESS',
            payload: `Register Success! You can login now.`
          })
        },err => {
          console.log(err)
            dispatch({
              type: 'AUTH_ERROR',
              payload:'Register Failed! Email are registered!'
            })
      })
    }
  }
}

export const afterError = () => {
  return {
    type: 'AFTER_ERROR'
  }
}

export const afterTwoSeconds = () => {
  return dispatch => {
    setTimeout(() => {
      dispatch(afterError())
    }, 3000)
  }
}

export const Logout = () => {
  cookie.remove('idLogin')
  cookie.remove('stillLogin')
  cookie.remove('role')
  cookie.remove('cartqty')
  cookie.remove('notification')

  return {
    type: 'LOGOUT_USER'
  }
}

export const keepLogin = (username, id, role,quantity,notification) => {
  return dispatch => {
    if (username === undefined || id === undefined || role === undefined || quantity === undefined || notification === undefined) {
      dispatch({
        type: 'KEEP_LOGIN',
        payload: {
          id: '',
          username: '',
          role: '',
          quantity: 0,
          notification: []
        }
      })
    }
    dispatch({
      type: 'KEEP_LOGIN',
      payload: {
        id,
        username,
        role,
        quantity,
        notification
      }
    })
  }
}

export const onEdit = (id,firstname, lastname, username,birthday,address,email) => {
  return async dispatch => {
    try {
      const res = await axios.patch(`/users/${id}`, {
        firstname, lastname, username,birthday,address,email
      })
      console.log(res.data[0].id)
      cookie.set('stillLogin', res.data[0].username, { path: '/' })
      dispatch({
        type: 'EDIT_SUCCESS',
        payload: {
          id: res.data[0].id,
          username: res.data[0].username,
          role: res.data[0].role
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
}

export const addToCart = (productId,userId) => {
  return async dispatch => {
    if(cookie.get('idLogin')){
      try{
        const res = await axios.post(`/cart/add`,{
          user_id:userId,
          product_id:productId
        })
        console.log(userId,productId)
        
        cookie.set('cartqty', res.data.length, { path: '/' })
        dispatch({
          type: 'ADD_CART',
          payload: {
            quantity:res.data.length
          }
        })
        Swal('Success', 'This item is succesfully added to your cart!', 'success')
      } catch (err) {
        console.log('Upload gagal' + err)
        Swal('','This item is already added to your cart!','error')
      }
    }else{
      Swal('Failed', 'Please Login to Continue', 'error')
    }
    }
  }

export const deleteCart = (productId,userId) => {
  return async dispatch => {
    Swal({
      text: 'Are you sure want to delete this item?',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then((result) => {
      if (result) {
        axios.delete(`/cart/delete/${productId}/${userId}`)
        .then(res => {
          cookie.set('cartqty', res.data[0].cart, { path: '/' })
        dispatch({
          type: 'ADD_CART',
          payload: {
            quantity: res.data[0].cart
          }
        })
            },
            err => {
              console.log(err)
            }
          )
          Swal(
            'Deleted!',
            'Your imaginary file has been deleted.',
            'success'
          )
      } else {
        Swal(
          'Cancelled',
          'Your Cart is Deleted',
          'error'
        )
      }
    })
  }
  }

