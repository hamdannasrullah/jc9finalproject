import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from '../../config/axios'
import cookies from 'universal-cookie'
import { onLoginClick, afterTwoSeconds, getNotif, Logout } from '../../actions'
import image from '../../img/avatar2.jpg'
import deliv from '../../img/delivery.png'
import packing from '../../img/packaging.png'
import payment from '../../img/payment_slip.png'
import success from '../../img/success.png'
import approved from '../../img/approved.png'
import '../cartIcon.css'
import swal from '@sweetalert/with-react'

const cookie = new cookies()

class Header extends Component {
  state = {
    products:[],
    notification:[]

  }
  componentDidMount() {
    this.getProduct()
    this.getNotification()
    setInterval(() => {
      this.getNotification()
    }, 5000)
    
    if(cookie.get('idLogin')){
      setInterval(() => {
        this.props.getNotif(cookie.get('idLogin'))
      }, 5000)
    }
  }

  getProduct = () => {
    axios.get('/products').then(res => {
        this.setState({ products: res.data})
    })
  }

  getNotification = async () => {
    await axios.get('/notification/order').then(res => {
      this.setState({notification : res.data})
    })
  }

  confirmImage = (src,id) => {
    swal({
      title:'Confirm Payment',
      content:
      <div className='card mx-auto' style={{width:'300px'}}>
          <img src={src} className='card-img-top' />
          <div className='card-footer'>
            <button className='btn btn-success' onClick={() => {this.accPayment(id)}}>
              Accept
            </button>
            <button className='btn btn-danger' onClick={() => {this.decPayment(id)}}>
              Decline
            </button>
          </div>

      </div>
    }
    )
  }

  accPayment = (id) => {
    const order_status = 3

    axios.patch(`/updateorder/${id}`,{
      order_status
    }).then(res => {
      swal({
        title:'Payment Confirmed',
        icon:'success'
      })
      this.getNotification()
    }, err => {
      console.log(err)
    })
  }

  decPayment = (id) => {
    const order_status = 1
    axios.patch(`/updateorder/${id}`,{
      order_status
    }).then(res => {
      swal({
        title:'Payment Declined',
        icon:'success'
      })
      this.getNotification()
    }, err => {
      console.log(err)
    })
  }

  handleKeyDown = (event) => {
    if(event.key == 'Enter'){
      event.preventDefault()
      console.log(event.key)
    }
  }

  onSubmitClick = () => {
      const user = this.username.value
      const pass = this.password.value
      this.props.onLoginClick(user, pass)
  }

  onErrorLogin = () => {
      if (this.props.error !== '') {
        return (
          <div>
            <div className='alert alert-danger mt-4 text-center'>
            {this.props.error}
            </div>
          </div>
          )
            } else {
            return null
        }
    }

  logout = () => {
      console.log('logout')        
      this.props.Logout()
    }

  profilePicture = () => {
    if (!cookie.get('avatar').includes('null')) {
      return (
        <img
          src={cookie.get('avatar')}
          alt={this.props.user.username}
          key={new Date()}
          className='rounded-circle avatar float-left'/>
        )
      }
      return (
        <img
          src={image}
          alt='avatar'
          style={{width:'50px'}}
          key={new Date()}
          className='rounded-circle float-left'/>
      )
    }

    notification = () => {
      if(cookie.get('role') == 1){
        return this.state.notification.map(item => {
          if(item.order_status === 2){
            return(
              <div className='card w-80 my-1' style={{height:'110px'}}>
                <div className='card-horizontal'>
                  <img src={item.payment_confirm} className='img-thumbnail' style={{width:'25%'}} 
                       onClick={() => {this.confirmImage(item.payment_confirm,item.id)}} role='button'/>
                  <div className='card-body p-0'>
                    <p className='ml-1 my-1'> {item.username} has finished payment confirmation! </p>
                    <p className='ml-1 mb-1'> Order Code : {item.order_code} </p>
                    <p className='ml-1 mb-1'> Order Date : {item.order_date.split('T')[0]} </p>
                    <div className='d-flex justify-content-between'>
                    <p className='ml-1 mb-1'> Transfer to : {item.bank_name} </p>
                    <Link to='/manageuser' >
                    <i className='fas fa-external-link-alt mr-2 text-secondary'></i>
                    </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          }else{
            return(
              <div className='card w-80 my-1' style={{height:'110px'}}>
                <div className='card-horizontal'>
                  <img src={success} className='img-thumbnail' style={{width:'25%'}}  />
                  <div className='card-body p-0'>
                    <p className='ml-1 my-1'> {item.username} Order has been delivered! </p>
                    <p className='ml-1 mb-1'> Order Code: {item.order_code} </p>
                    <p className='ml-1 mb-1'> Order Date: {item.order_date.split('T')[0]} </p>
                    <div className='d-flex justify-content-between'>
                    <p className='ml-1 mb-1'> Transfer to: {item.bank_name} </p>
                    <Link to='/manageuser' >
                    <i className='fas fa-external-link-alt mr-2 text-secondary'></i>
                    </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        })
      }else if(cookie.get('role') == 2){
        if(cookie.get('notification').length !== 0){
          return cookie.get('notification').map(item => {
            if(item.order_status_description === 'Waiting For Payment'){
              return(
                <div className='card w-80 my-1' style={{height:'100px'}}>
                  <div className='card-horizontal'>
                  <img src={payment} className='img-thumbnail' style={{width:'25%'}} />
                  <div className='card-body p-0'>
                    <p className='ml-1 mb-1'>Sorry {item.username}, your payment was declined</p>
                    <p className='ml-1 mb-1'> Order Code: {item.order_code} </p>
                    <p className='ml-1 mb-1'> Order Date: {item.order_date.split('T')[0]} </p>
                    <div className='d-flex justify-content-between'>
                    <p className='ml-1 mb-1'> Order Status: {item.order_status_description} </p>
                  <Link to={`/orderitem/${item.order_code}`} >
                  <i className='fas fa-external-link-alt mr-2 text-secondary'></i>
                  </Link>
                  </div>
                  </div>
                  </div>
                </div>
              )
            }else if(item.order_status_description === 'On Packaging'){
                return(
                  <div className='card w-80 my-1' style={{height:'100px'}}>
                    <div className='card-horizontal'>
                    <img src={packing} className='img-thumbnail' style={{width:'25%'}} />
                    <div className='card-body p-0'>
                      <p className='ml-1 mb-1'> Hi {item.username} , Your order is on packaging!</p>
                      <p className='ml-1 mb-1'> Order Code: {item.order_code} </p>
                      <p className='ml-1 mb-1'> Order Date: {item.order_date.split('T')[0]} </p>
                      <div className='d-flex justify-content-between'>
                      <p className='ml-1 mb-1'> Order Status: {item.order_status_description} </p>
                    <Link to={`/orderitem/${item.order_code}`} >
                    <i className='fas fa-external-link-alt mr-2 text-secondary'></i>
                    </Link>
                    </div>
                    </div>
                    </div>
                  </div>
                )
              }else if(item.order_status_description === 'On Delivery'){
                  return(
                    <div className='card w-80 my-1' style={{height:'100px'}}>
                      <div className='card-horizontal'>
                      <img src={deliv} className='img-thumbnail' style={{width:'25%'}} />
                      <div className='card-body p-0'>
                        <p className='ml-1 mb-1'> Hi {item.username}, Your order is on Delivery!</p>
                        <p className='ml-1 mb-1'> Order Code: {item.order_code} </p>
                        <p className='ml-1 mb-1'> Order Date : {item.order_date.split('T')[0]} </p>
                        <div className='d-flex justify-content-between'>
                        <p className='ml-1 mb-1'> Order Status: {item.order_status_description} </p>
                      <Link to={`/orderitem/${item.order_code}`} >
                      <i className='fas fa-external-link-alt mr-2 text-secondary'></i>
                      </Link>
                      </div>
                      </div>
                      </div>
                    </div>
                  )
                }else if(item.order_status_description === 'Payment Done'){
                  return(
                    <div className='card w-80 my-1' style={{height:'100px'}}>
                      <div className='card-horizontal'>
                      <img src={approved} className='img-thumbnail' style={{width:'25%'}} />
                      <div className='card-body p-0'>
                        <p className='ml-1 mb-1'> Hi {item.username}, Your payment is approved!</p>
                        <p className='ml-1 mb-1'> Your item will be on packaging soon</p>
                        <p className='ml-1 mb-1'> Order Code: {item.order_code} </p>
                        <p className='ml-1 mb-1'> Order Date: {item.order_date.split('T')[0]} </p>
                        <div className='d-flex justify-content-between'>
                        <p className='ml-1 mb-1'> Order Status: {item.order_status_description} </p>
                      <Link to={`/orderitem/${item.order_code}`} >
                      <i className='fas fa-external-link-alt mr-2 text-secondary'></i>
                      </Link>
                      </div>
                      </div>
                      </div>
                    </div>
                  )
                } else{
                    return(
                      <div className='card w-80 my-1' style={{height:'100px'}}>
                        <div className='card-horizontal'>
                        <img src={success} className='img-thumbnail' style={{width:'25%'}} />
                        <div className='card-body p-0'>
                          <p className='ml-1 mb-1'> Thank you for transaction, {item.username}</p>
                          <p className='ml-1 mb-1'> Order {item.order_code} success!</p>
                          <p className='ml-1 mb-1'> Order Date: {item.order_date.split('T')[0]} </p>
                          <div className='d-flex justify-content-between'>
                          <p className='ml-1 mb-1'> Order Status: {item.order_status_description} </p>
                        <Link to={`/orderitem/${item.order_code}`} >
                        <i className='fas fa-external-link-alt mr-2 text-secondary'></i>
                        </Link>
                        </div>
                        </div>
                        </div>
                      </div>
                    )
            }
          })
        }else{
          return null
        }
      }
    }
  render() {
    const { username,role } = this.props.user
    if (role === 1) {
      return (
        <div>
          <nav className='navbar sticky-top navbar-expand-md navbar-light bg-light border-bottom'>
            <div className='container'>
              <Link className='navbar-brand' to='/'>
                <h2>KOMPIPEDIA</h2>
              </Link>

              <button
                className='navbar-toggler'
                data-toggle='collapse'
                data-target='#navbarNav2'>
                <span className='navbar-toggler-icon' />
              </button>

              <div className='collapse navbar-collapse row'
                  id='navbarNav2'>
                    <ul className='navbar-nav col-12'>
                    <li className='nav-item m-2 ml-auto' />
                  <div className='collapse navbar-collapse row' 
                  id='navbarNav2'>
                    <ul className='navbar-nav col-12'>
                    <li className='nav-item m-2 ml-auto'>
                    </li>
                    <li className='nav-item dropdown m-1 mx-auto mx-lg-0 m-lg-2'>
                    <Link className='nav-link' to='/' data-toggle='dropdown' >
                    <i className='fas fa-align-justify fa-2x text-secondary' />
                    </Link>
                    <div className='dropdown-menu manage py-0'>
                    <div  className='mx-auto card' style={{ width: '100%' }}>
                    <div className='card mt-0'>
                    <div className='mx-auto card' style={{width:'200px'}}>
                    <div className='card-header text-center py-1'>
                     <div className='card-title text-dark font-weight-bold'>
                     <p>MANAGE </p></div><p></p>
                    <Link to='/manageuser'><p className='text-left text-dark'> ORDER </p> </Link>
                    <Link to='/manageproduct'><p className='text-left text-dark'> PRODUCT </p> </Link>
                    <Link to='/managepart'><p className='text-left text-dark'> PART </p> </Link>
                    <Link to='/managebank'><p className='text-left text-dark'> BANK </p> </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

                  <li className='nav-item dropdown m-1 mx-auto mx-lg-0 m-lg-2 pt-2'>
                    <Link
                      className='nav-link'
                      to='/admin/dashboard'
                      data-toggle='dropdown' >
                      <i class='fas fa-bell fa-2x text-secondary' />
                      <span
                        className='badge badge-warning'
                        id='lblCartCount' >
                        {this.state.notification.length}
                      </span>
                    </Link>
                    <div className='dropdown-menu notification py-0'>
                      <div className='mx-auto card'
                        style={{ width: '100%' }} >
                        <div className='card-header text-center py-1'>
                          <div className='card-title text-dark font-weight-bold'>
                            <p>Notification</p>
                          </div>
                        </div>
                        <div
                          className='card-body'
                          style={{
                            overflowY: 'scroll',
                            height: '100%'
                          }}
                        >
                          {this.notification()}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className='nav-item dropdown m-1 mx-auto mx-lg-0 m-lg-2'>
                    <Link className='nav-link d-flex'
                      data-toggle='dropdown'
                      to='/' >
                      <i className='fas fa-user fa-2x text-secondary my-auto' />
                      <div className='d-flex flex-column text-left mx-2'>
                        <p className='text-center my-0'> Hi, {username}! </p>
                        <p className='text-center my-0 mr-auto'> Login as Admin</p>
                      </div>
                      <i class='fas fa-caret-down mb-auto' />
                    </Link>
                    <div className='dropdown-menu py-0'>
                    <div className='card mt-0'>
                    <div className='d-flex justify-content-between card-header'>
                    <div className='card-body'>
                    <Link to='/admin/dashboard' className='btn btn-block text-dark'>PROFILE </Link>
                    <p className='btn btn-block text-dark' onClick={()=>{this.logout()}}>LOGOUT</p>
                    </div>
                    </div>
                    </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      )
      
    } else if(role === 2){
        return (
          <div>
            <nav className='navbar sticky-top navbar-expand-md navbar-light bg-light border-bottom'>
              <div className='container'>
                <Link className='navbar-brand' to='/'>
                <h2>KOMPIPEDIA</h2>
                </Link>

                <button className='navbar-toggler'
                  data-toggle='collapse'
                  data-target='#navbarNav2' >
                  <span className='navbar-toggler-icon' />
                </button>
  
                <div className='collapse navbar-collapse row' id='navbarNav2' >
                  <ul className='navbar-nav col-12'>
                    <li className='nav-item mx-2 my-auto ml-auto'>
                    </li>
                    <li className='nav-item dropdown m-1 mx-auto mx-lg-0 m-lg-2'>
                      <Link className='nav-link'
                        to='/'
                        data-toggle='dropdown' >
                        <i class='fas fa-bell fa-2x text-secondary'></i>
                        <span className='badge badge-warning' id='lblCartCount'>{cookie.get('notification').length}</span>
                      </Link>
                      <div className='dropdown-menu notification py-0'>
                        <div className='mx-auto card' style={{width:'400px'}}>
                          <div className='card-header text-center py-1'>
                            <div className='card-title text-dark font-weight-bold'>
                              <p>Notification</p>
                            </div>
                          </div>
                          <div className='card-body' 
                          style={{ overflowY: 'scroll', height: '400px' }}>
                            {this.notification()}
                          </div>
                          <div className='card-footer text-center'>
                            <p>
                              <Link to='/notification' className='text-dark'> See All Orders Notification </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li className='nav-item dropdown mx-auto mx-lg-0 my-auto'>
                      <Link className='nav-link'
                        to='/'
                        data-toggle='dropdown' >
                       <i className='fas fa-user fa-2x text-secondary' />
                      </Link>
                      
                      <div className='dropdown-menu form-wrapper user mt-0 py-0'>
                        <div className='card mt-0'>
                          <div className='d-flex justify-content-between card-header'>
                            {this.profilePicture()}
                            <p className='text-right font-weight-bold my-auto'
                              style={{ fontSize: 14 }} >
                              Hai {username}!
                            </p>
                          </div>

                          <div className='card-body'>
                            <Link to='/profile'>
                              <p className='text-left text-dark'>Profil</p>
                            </Link>

                            <Link to='/passwordupdate'>
                              <p className='text-left text-dark'>Password</p>
                            </Link>

                            <Link to='/addresscontact'>
                              <p className='text-left text-dark'>Alamat</p>
                            </Link>

                            <Link to='/order'>
                              <p className='text-left text-dark'>Transaksi</p>
                            </Link>

                            <Link to='/orderhistory'>
                              <p className='text-left text-dark'>Histori Transaksi</p>
                            </Link>

                            <Link to='/payment'>
                              <p className='text-left text-dark'>Pembayaran</p>
                            </Link>

                            <button className='btn btn-light btn-block mt-5'
                              onClick={this.logout} >
                              Logout{' '}
                              <i className='fas fa-sign-out-alt text-secondary' />
                            </button>

                          </div>
                        </div>
                      </div>
                    </li>
                    <li className='nav-item m-1 mx-auto mx-md-2 my-auto'>
                    </li>
                    <li className='nav-item m-1 mx-auto my-auto mx-md-2'>
                      <Link className='nav-a' to='/ShoppingCart'>
                        <i className='fas fa-shopping-cart fa-2x text-secondary' />
                        <span className='badge badge-warning' id='lblCartCount'>{cookie.get('cartqty')}</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        )
    }else{
      return (
        <div>
          <nav className='navbar sticky-top navbar-expand-md navbar-light bg-light border-bottom'>
            <div className='container'>
              <Link className='navbar-brand' to='/'>
              <h2 >KOMPIPEDIA</h2>
              </Link>

              <div className='collapse navbar-collapse row' id='navbarNav2'>
                <ul className='navbar-nav col-12'>
                  <li className='nav-item m-2 ml-auto'>
                  </li>

                  <li className='nav-item dropdown m-1 mx-auto mx-lg-0 m-lg-2'>
                    <Link className='nav-link' to='/' data-toggle='dropdown' >
                    <i className='fas fa-user fa-2x text-secondary' />
                    </Link>
                    <div className='dropdown-menu py-0'>
                    <div className='card mt-0'>
                    <div className='d-flex justify-content-between card-header'>
                    <div className='card-body'>
                    <Link to='/login'><p className='text-left text-dark'> LOGIN </p> </Link>
                    <Link to='/register'><p className='text-left text-dark'> REGISTER </p></Link>
                    </div>
                    </div>
                    </div>
                    </div>
                  </li>

                  <li className='nav-item m-1 mx-auto mx-lg-0 m-lg-2'>
                    <Link className='nav-link' to='/ShoppingCart'>
                      <i className='fas fa-shopping-cart fa-2x text-secondary' />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      )  
    }
  }
}

const mapStateToProps = state => {
  return { user: state.auth ,error : state.auth.error, empty: state.auth.empty, quantity:state.auth.quantity, notification:state.auth.notification }
}

export default connect(
  mapStateToProps,
  { Logout, onLoginClick, afterTwoSeconds,getNotif }
)(Header)
