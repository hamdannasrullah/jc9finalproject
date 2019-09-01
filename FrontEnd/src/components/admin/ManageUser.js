import React, { Component } from 'react'
import axios from '../../config/axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import cookies from 'universal-cookie'

import '../style.css'
import swal from 'sweetalert'

const cookie = new cookies()

class ManageUser extends Component {
  state = {
    order: [],
    orderStatus : [],
    orderHistory:[],
    selectedID: 0
  }
  componentDidMount() {
    this.getOrder()
  }

  getOrder = () => {
    axios.get('/orders/ongoing').then(res => {
      this.setState({ order: res.data, selectedID: 0 })
    })
    axios.get('/orderstatus').then(res => {
      this.setState({ orderStatus: res.data})
    })
    axios.get('/historyorder').then(res => {
      this.setState({ orderHistory: res.data})
    })
  }

  onUpdate = id => {
    this.setState({
      selectedID : id
    })
  }

  updateOrder = (id,orderstatus) => {
    const order_status = orderstatus + 1
    
    axios.patch(`/updateorder/${id}`,{
      order_status
    }).then(res => {
      swal({
        title:'Success',
        icon:'success'
      })
      this.getOrder()
    },err => {
      console.log(err)
      
    })
  }

  historyOrder = () => {
    return this.state.orderHistory.map(item => {
        return(
          <tr key={item.id}>
            <td> {item.username} </td>
            <td> {item.order_code} </td>
            <td> {item.order_date.split('T')[0]} </td>
            <td> {item.order_destination} </td>
            <td> {item.bank_name} </td>
            <td> {item.total} </td>
            <td>
              <img src={item.payment_confirm} alt={item.order_code} style={{width:'30%'}} />
            </td>
            <td> {item.order_status_description} </td>
          </tr>
          )
      })
  }

  onGoingOrder = () => {
    return this.state.order.map(item => {
        return(
          <tr key={item.id}>
            <td> {item.username} </td>
            <td> {item.order_code} </td>
            <td> {item.order_date.split('T')[0]} </td>
            <td> {item.order_destination} </td>
            <td> {item.bank_name} </td>
            <td> {item.total} </td>
            <td>
              <img src={item.payment_confirm} alt={item.order_code} style={{width:'25%'}} />
            </td>
            <td> {item.order_status_description} </td>
            <td>
              <button className='btn btn-outline-success' onClick={() => {this.updateOrder(item.id,item.order_status)}}>
                Update Order Status
              </button>
            </td>
          </tr>
          )
      }
    )
  }  
 
  render() {
    var userCookie = cookie.get('stillLogin')

    if (userCookie === undefined ) {
      return (
        <Redirect to='/admin/login' />
      ) 
    }else{
      return (
        <div id='page-wrap'>
          <h1 className='display-4 text-center'>Manage User Order</h1>
          <div id='page-wrap'>
            <div className='container' style={{
              overflowY: 'scroll',
              overflowX: 'auto',
              height: '700px'
            }}
            >
              <ul className='nav nav-tabs' id='myTab' role='tablist'>
                <li className='nav-item'>
                  <a
                    className='nav-link lead active'
                    id='home-tab'
                    data-toggle='tab'
                    href='#home'
                    role='tab'
                    aria-controls='home'
                    aria-selected='true'>
                    On Going Order
                  </a>
                </li>
                <li className='nav-item'>
                  <a
                    className='nav-link lead'
                    id='profile-tab'
                    data-toggle='tab'
                    href='#profile'
                    role='tab'
                    aria-controls='profile'
                    aria-selected='false'>
                    Finished Order
                  </a>
                </li>
              </ul>
              <div className='tab-content profile-tab' id='myTabContent'>
                <div 
                className='tab-pane fade show active'
                  id='home'
                  role='tabpanel'
                  aria-labelledby='home-tab' >
                  <table className='table table-hover'>
                    <thead>
                      <th scope='col'>Username</th>
                      <th scope='col'>Order Code</th>
                      <th scope='col'>Order Date</th>
                      <th scope='col'>Order Destination</th>
                      <th scope='col'>Bank</th>
                      <th scope='col'>Total</th>
                      <th scope='col'>Payment Confirm</th>
                      <th scope='col'>Order Status</th>
                      <th scope='col'> Action</th>
                    </thead>
                    <tbody>
                      {this.onGoingOrder()}
                    </tbody>

                  </table>
                </div>
                <div class='tab-pane fade' id='profile' role='tabpanel' aria-labelledby='profile-tab'>
                  <table className='table table-hover'>
                    <thead>
                      <th scope='col'>Username</th>
                      <th scope='col'>Order Code</th>
                      <th scope='col'>Order Date</th>
                      <th scope='col'>Order Destination</th>
                      <th scope='col'>Bank</th>
                      <th scope='col'>Total</th>
                      <th scope='col'>Payment Confirm</th>
                      <th scope='col'>Order Status</th>
                    </thead>
                    <tbody>
                      {this.historyOrder()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = state => {
  return { user: state.auth }
}

export default connect(mapStateToProps)(ManageUser)
