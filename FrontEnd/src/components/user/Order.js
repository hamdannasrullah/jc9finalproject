import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import axios from '../../config/axios'
import cookies from 'universal-cookie'
import {Link} from 'react-router-dom'
import swal from 'sweetalert'

const cookie = new cookies()

var moment = require('moment')


class Order extends Component {
    cardheader = {
        backgroundColor: '#d3d3d3'
      }
    
    state = {
        order : undefined
    }
    
    componentDidMount(){
        const userid = cookie.get('idLogin')
        this.getOrder(userid)
    }

    getOrder = async userid => {
        try {
            const res = await axios.get(
              `/order/${userid}`
            )
            this.setState({
              order: res.data
            })  
          } catch (err) {
            console.log(err)
          }
    }

    updateOrder = (id,orderstatus) => {
      const order_status = orderstatus + 1

      axios.patch(`/updateorder/${id}`,{
        order_status
      }).then(res => {
        swal({
          title:'Success',
          text:'Thank you for your confirmation!',
          icon:'success'
        })
        this.getOrder(cookie.get('idLogin'))
      }, err => {
        console.log(err)
        
      })
    }

    renderOrder = () => {
        if(this.state.order === undefined){
            return(
            <div className='card'>
                <div className='card-body'>
                    <h1>Your Order is Empty!</h1>
                </div>
            </div>
            )
        }

        return this.state.order.map(item => {
          var date = moment(item.order_date)
          var order_date = date.utc().format('DD-MM-YYYY')
          if(item.order_status_description === 'On Delivery'){
            console.log(item)
            
            return(
                <div className='card m-4'>
                    <div className='card-header d-flex justify-content-between text-secondary'>
                        <p className='lead font-weight-bold'> Order Code : {item.order_code} </p>
                        <button className='btn btn-outline-success' onClick={() => {this.updateOrder(item.id,item.order_status)}}>Item Delivered</button>
                    </div>
                    <div className='card-body'>
                        <p className='lead'>Order Date : {order_date} </p>
                        <p className='lead'>Order Status : {item.order_status_description} </p>
                        <p className='lead'> Items : {item.quantity} </p>
                    </div>
                    <div className='card-footer text-right'>
                        <Link to={`/orderitem/${item.order_code}`} className='text-dark'>
                        <p className='lead font-weight-bold'> See Order Detail <i class='fas fa-arrow-right'></i></p>
                        </Link>
                    </div>
                </div>
            )
          }else{
            return(
                <div className='card m-4'>
                    <div className='card-header d-flex justify-content-between text-secondary'>
                        <p className='lead font-weight-bold'> Order Code: {item.order_code} </p>
                    </div>
                    <div className='card-body'>
                        <p className='lead'>Order Date: {order_date} </p>
                        <p className='lead'>Order Status: {item.order_status_description} </p>
                        <p className='lead'> Items: {item.quantity} </p>
                    </div>
                    <div className='card-footer text-right'>
                        <Link to={`/orderitem/${item.order_code}`} className='text-dark'>
                        <p className='lead font-weight-bold'> See Order Detail <i class='fas fa-arrow-right'></i></p>
                        </Link>
                    </div>
                </div>
            )
          }
        })
    }

    render() {
        if (cookie.get('stillLogin')) {
            if (this.state.order !== undefined) {
            return (
              <div className='container'>
                <div className='row mt-5'>
                  <div className='col-3'>
                    <div className='card p-0'>
                      <h3 className='text-center card-title p-3'>
                        Akun Anda
                      </h3>
                      <div className='card-header'>
                        <Link to='/profile' className='text-dark'>
                          <p className='lead text-center'>Profil</p>
                        </Link>
                      </div>

                      <div className='card-header'>
                      <Link to='/passwordupdate' className='text-dark'>
                      <p className='lead text-center'>Password Update</p>
                      </Link>
                      </div>

                      <div className='card-header'>
                        <Link to='/addresscontact' className='text-dark'>
                          <p className='lead text-center'>Alamat dan <p>Informasi Kontak</p> 
                          </p>
                        </Link>
                      </div>

                      <div className='card-header'  style={this.cardheader}>
                      <Link to='/order' className='text-dark'>
                    <p className='lead text-center'>Transaksi Anda</p>
                    </Link>
                      </div>

                      <div className='card-header'>
                      <Link to='/orderhistory' className='text-dark'>
                    <p className='lead text-center'>Histori Transaksi</p>
                    </Link>
                      </div>

                      <Link to='payment' className='text-dark'>
                      <div className='card-header'>
                        <p className='lead text-center'>Pembayaran</p>
                      </div>
                      </Link>
                    </div>
                  </div>
                  <div className='col-7'>
                    <div className='card'>
                      <ul className='list-group list-group-flush'>
                        <div className='card-header'>
                          <div className='lead text-center'>
                          <h3>Transaksi Anda</h3>
                          </div>
                        </div>
                        {this.renderOrder()}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
        } else {
            return <h1>Loading</h1>
          }
        } else {
          return <Redirect to='/login' />
        }
      }
}

const mapStateToProps = state => {
    return { user: state.auth }
  }
  
  export default connect(mapStateToProps)(Order)
  