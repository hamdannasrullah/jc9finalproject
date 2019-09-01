import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import axios from '../../config/axios'
import cookies from 'universal-cookie'
import {Link} from 'react-router-dom'

const cookie = new cookies()

class Order extends Component {
    cardheader = {
        backgroundColor: '#d3d3d3'
      }
    
    state = {
        orderitem : undefined
    }
    
    componentDidMount (){
        const ordercode = parseInt(this.props.match.params.orderid)

        this.getOrderItem(ordercode)
    }

    getOrderItem = async ordercode => {
        try {
            const res = await axios.get(
              `/orderitem/${ordercode}`
            )
            this.setState({
              orderitem: res.data
            })
          } catch (err) {
            console.log(err)
          }
    }

    renderOrder = () => {
        if(this.state.orderitem === undefined){
            return(
            <div className='card'>
                <div className='card-body'>
                    <h1>Your Order is Empty!</h1>
                </div>
            </div>
            )
        }
        return this.state.orderitem.map((product, index) => {
            return(
            <div className='col-12' key={product.id}>
              <div className='card-header'>
              <div className='card-body'>
                <div className='row'>
                  <div className='col-4'>
                    <img
                      className='card-img-center img-thumbnail'
                      src={product.image}
                      alt={product.product_name}/>
                  </div>
                  </div>

                <div className='col-12'>
                  <Link to={`/detailproduct/${product.id}`}>
                  <p className='card-text font-weight-bold'>
                    {product.product_name}
                  </p>
                  </Link>

                  <p className='font-weight-bold card-text text-secondary'>
                    {product.brand_name}
                  </p>
                  <p className='lead card-text text-danger'>
                  <li className='font-weight-bold'>Harga:</li>Rp {product.price.toLocaleString()}
                  </p>
                  <p className='lead card-text text-danger'>
                  <li className='font-weight-bold'>Quantity:</li> {product.quantity} pc(s)
                  </p>
                </div>
              </div>
            </div>
          </div>
            )
        })
    }

    render() {
        const ordercode = parseInt(this.props.match.params.orderid)
        if (cookie.get('stillLogin')) {
            if (this.state.orderitem !== undefined) {
            return (
              <div className='container'>
                <div className='row mt-5'>
                  <div className='col-3'>
                    <div className='card p-0'>
                      <h3 className='text-center card-title p-3'>Akun Anda
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
                          <p className='lead text-center'>Alamat & Info Kontak</p>
                        </Link>
                      </div>

                      <div className='card-header'  style={this.cardheader}>
                      <Link to='/order' className='text-dark'>
                      <p className='lead text-center'>Transaksi Saya</p>
                      </Link>
                      </div>

                      <div className='card-header'>
                      <Link to='/orderhistory' className='text-dark'>
                      <p className='lead text-center'>Histori Transaksi</p>
                      </Link>
                      </div>
                      
                        <div className='card-header'>
                          <p className='lead text-center'>Pembayaran</p>
                        <div className='card-body' />
                      </div>
                    </div>
                  </div>
                  <div className='col-7'>
                    <div className='card'>
                      <ul className='list-group list-group-flush'>
                        <div className='card-header'>
                          <div className='text-center'>
                          <h3>Order Code {ordercode} </h3>
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
  