import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from '../../config/axios'
import cookies from 'universal-cookie'
import { Link } from 'react-router-dom'
import Swal from '@sweetalert/with-react'

// import imgpayment from '../../img/payment_slip.png'

const cookie = new cookies()

class Payment extends Component {
  cardheader = {
    backgroundColor: '#d3d3d3'
  }

  state = {
    order: undefined,
    bank: [],
    // image: imgpayment
  }

  componentDidMount() {
    const userid = cookie.get('idLogin')
    this.getOrder(userid)
    this.getBank()
  }

  getOrder = async userid => {
    try {
      const res = await axios.get(`/order/${userid}`)
      this.setState({
        order: res.data
      })
    } catch (err) {
      console.log(err)
    }
  }

  getBank = () => {
    axios.get('/bank').then(res => {
      this.setState({ bank: res.data })
    })
  }

  howToPay = () => {
    Swal(
      <div className='card w-100'>
        <div className='card-header'>
          <h3>Instruction</h3>
        </div>
        <div className='card-body w-80'>
          <p className='text-secondary text-left'>
            1. Transfer to Bank's Account that you choose with total amount of your order
          </p>
          <p className='text-secondary text-left'>BCA</p>
          <p className='text-secondary text-left'>Mandiri </p>
          <p className='text-secondary text-left'>CIMB Niaga</p>
          <p className='text-secondary text-left'>Danamon</p>
          <p className='text-secondary text-left'>
            2. Back to payment page and then choose bank from the bank list that
            shown
          </p>
          <p className='text-secondary text-left'>4. Input Your Order Code</p>
          <p className='text-secondary text-left'>5. Upload Payment Slip</p>
          <p className='text-secondary text-left'>6. Wait for Confirmation</p>
          <p className='text-secondary text-center font-weight-bold'>
            And Your order has been successfully paid!
          </p>
        </div>
      </div>
    )
  }

  renderBank = () => {
    return this.state.bank.map(item => {
      return <option value={item.id}> {item.bank_name} </option>
    })
  }

  handleChange = err => {
    this.setState({ image: URL.createObjectURL(err.target.files[0]) })
  }

  payOrder = async () => {
    const formData = new FormData()
    const id = this.idbank.value
    const order_code = this.orderCode.value
    const imagefile = this.gambar

    formData.append('payment_confirmation', imagefile.files[0])
    formData.append('id', id)

    await axios.post(`/payment/uploads/${order_code}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
          Swal({
              title: 'Payment Success',
              icon: 'success',
              text : 'Your Order has been successfully paid!'
          })
          
      }, err => {
          console.log(err.response.data)
          Swal({
            title: 'Payment Failed',
            icon: 'error',
            text: 'Please complete all form!'
          })
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
                  <h3 className='text-center card-title p-3'>Akun Anda</h3>
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
                      <p className='lead text-center'>Alamat dan <p>Informasi Kontak</p> </p>
                    </Link>
                  </div>

                  <div className='card-header'>
                    <Link to='/order' className='text-dark'>
                      <p className='lead text-center'>Transaksi Anda</p>
                    </Link>
                  </div>

                  <div className='card-header'>
                  <Link to='/orderhistory' className='text-dark'>
                    <p className='lead text-center'>Histori Transaksi</p>
                    </Link>
                  </div>

                  <div className='card-header' style={this.cardheader}>
                    <Link to='/payment' className='text-dark'>
                      <p className='lead text-center'>Pembayaran</p>
                    </Link>
                  </div>
                </div>
              </div>

              <div className='col-7'>
                <div className='card'>
                  <div className='card-header d-flex justify-content-between'>
                    <h3 className='text-secondary'>Payment</h3>
                    <button
                      className='btn btn-transparent text-dark'
                      onClick={this.howToPay} >
                      {' '}
                      <i class='far fa-question-circle' />How to Pay
                    </button>
                  </div>

                  <div className='card-body'>
                    <div className='d-flex flex-wrap'>
                      <p className='lead'>Pilih Bank: </p>
                      <select
                        className='form-control'
                        ref={input => {this.idbank = input }}>
                        <option disabled selected>
                          Pilihan Bank
                        </option>
                        {this.renderBank()}
                      </select>
                    </div>

                    <div className='d-flex flex-wrap'>
                      <p className='lead'>Input Your Order Code: </p>
                      <input
                        className='form-control'
                        ref={input => { this.orderCode = input }}
                        type='text'/>
                    </div>
                    <div className='d-flex'>
                      <p className='lead mr-2'>Upload Bukti Pembayaran Anda: </p>
                    </div>
                    <div className='d-flex flex-column'>
                      <div className='custom-file' style={{ width: '200px' }}>
                        <input
                          type='file'
                          id='myfile'
                          ref={input => (this.gambar = input)}
                          className='custom-file-input'
                          onChange={this.handleChange}/>
                        <label className='custom-file-label' for='myfile'>
                          Choose Image
                        </label>
                      </div>
                    </div>
                    <div className='text-left mt-4'>
                      <button className='btn btn-success' onClick={this.payOrder}>
                        <i class='fas fa-money-check-alt' /> PAY
                      </button>
                    </div>
                  </div>
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

export default connect(mapStateToProps)(Payment)
