import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
// import axios from '../../config/axios'
import cookies from 'universal-cookie'
import { Link } from 'react-router-dom'
import { getNotif } from '../../actions'
import deliv from '../../img/delivery.png'
import packing from '../../img/packaging.png'
import payment from '../../img/payment_slip.png'
import success from '../../img/success.png'
import approved from '../../img/approved.png'

const cookie = new cookies()

// var moment = require('moment')

class Notification extends Component {
    cardheader = {
        backgroundColor: '#d3d3d3'
      }
    
    state = {
        order : undefined
    }

    componentDidMount(){
        const userid = cookie.get('idLogin')
        if(cookie.get('idLogin')){
            setInterval(() => {
              this.props.getNotif(cookie.get('idLogin'))
            }, 5000)
          }
    }

    renderNotif = () => {
        if(cookie.get('notification').length !== 0){
            return cookie.get('notification').map(item => {
              if(item.order_status_description === 'Waiting For Payment'){
                return(
                  <div className='card w-80 my-1' style={{height:'120px'}}>
                    <div className='card-horizontal'>
                    <img src={payment} className='img-thumbnail' style={{width:'10%'}} />
                    <div className='card-body p-0'>
                      <p className='ml-1 mb-1'> Sorry {item.username}, your payment was declined</p>
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
                    <div className='card w-80 my-1' style={{height:'120px'}}>
                      <div className='card-horizontal'>
                      <img src={packing} className='img-thumbnail' style={{width:'10%'}} />
                      <div className='card-body p-0'>
                        <p className='ml-1 mb-1'> Hi {item.username}, your order is on packaging!</p>
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
                      <div className='card w-80 my-1' style={{height:'120px'}}>
                        <div className='card-horizontal'>
                        <img src={deliv} className='img-thumbnail' style={{width:'10%'}} />
                        <div className='card-body p-0'>
                          <p className='ml-1 mb-1'> Hi {item.username}, Your order is on Delivery!</p>
                          <p className='ml-1 mb-1'> Please confirm if your item has arrived! </p>
                          <p className='ml-1 mb-1'> Order Code: {item.order_code} </p>
                          <p className='ml-1 mb-1'> Order Date: {item.order_date.split('T')[0]} </p>
                          <div className='d-flex justify-content-between'>
                          <p className='ml-1 mb-1'> Order Status : {item.order_status_description} </p>
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
                      <div className='card w-80 my-1' style={{height:'120px'}}>
                        <div className='card-horizontal'>
                        <img src={approved} className='img-thumbnail' style={{width:'10%'}} />
                        <div className='card-body p-0'>
                          <p className='ml-1 mb-1'> Hi {item.username}, your payment is approved!</p>
                          <p className='ml-1 mb-1'> Your item will be on packaging soon.</p>
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
                        <div className='card w-80 my-1' style={{height:'130px'}}>
                          <div className='card-horizontal'>
                          <img src={success} className='img-thumbnail' style={{width:'10%'}} />
                          <div className='card-body p-0'>
                            <p className='ml-1 mb-1'> Order {item.order_code} Success</p>
                            <p className='ml-1 mb-1'> Thank you for shopping, {item.username}!</p>
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

    render() {
        
        if (cookie.get('stillLogin')) {
            return (
              <div className='container'>
                <p className='lead mt-5'> Your Notification</p>
                <hr />
                {this.renderNotif()}
              </div>
            )
        } else {
          return <Redirect to='/login' />
        }
      }
}

const mapStateToProps = state => {
    return { user: state.auth }
  }
  
export default connect(mapStateToProps, {getNotif})(Notification)
  