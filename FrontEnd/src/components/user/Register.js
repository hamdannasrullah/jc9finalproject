import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from '../../config/axios'

import { onRegister } from '../../actions'
import { afterTwoSeconds } from '../../actions'

class Register extends Component {
    state = {
        kodepos : [],
        filterKodepos : [],
        address:[]
    }
    componentDidMount() {
      this.getKodepos()
    }
  onRegisterClick = () => {
    const firstname = this.firstname.value
    const lastname = this.lastname.value
    const username = this.username.value
    const email = this.email.value
    const password = this.password.value
    const birthday = this.birthday.value
    const address = this.address.value
    const phone_number = this.phone_number.value


    var kodepos = ''
    if (this.kodepos.value !== ''){
      kodepos = this.kodepos.value
    }else{
      kodepos = null
    }
    console.log(kodepos)
    
    this.props.onRegister(
      firstname,
      lastname,
      username,
      email,
      password,
      birthday,
      address,
      kodepos,
      phone_number
    )
  }
  onErrorRegister = () => {
    if (this.props.error !== '') {
      return (
        <div className='alert alert-danger mt-4 text-center'>
          {this.props.error}
        </div>
      )
    } else if (this.props.empty !== '') {
      return (
        <div className='alert alert-danger mt-4 text-center'>
          {this.props.empty}
        </div>
      )
    } else {
      return null
    }
  }

  onRegSuccess = () => {
    if (this.props.success !== '') {
      return (
        <div className='alert alert-success mt-4 text-center'>
          {this.props.success}
        </div>
      )
    } else {
      return null
    }
  }

  getKodepos = async () => {
    try {
      const res = await axios.get(`/kodepos`)
      this.setState({
        kodepos: res.data
      })
      
    } catch (err) {
      console.log(err)
    }
  }

  selectKodepos = () => {
    return this.state.filterKodepos.map(item => {
      return (
        <option key={item.id} value={item.id}>
          {item.kodepos}
        </option>
      )
    })
  }

  filterKodepos = () => {
    const search = this.searchKodepos.value
    

    if (search.length > 2){
        var arrSearch = this.state.kodepos.filter(item => {
          return item.kodepos.toLowerCase().includes(search)
        })
        this.setState({ filterKodepos: arrSearch })
    }
    if(search.length === 0){
        this.setState({ filterKodepos: [] })
    }
  }

  filterAddress = () => {
      const id = this.kodepos.value

      if(id === ''){
        this.setState({
          address:[]
        })
      }
      axios
        .get(`/address/${id}` 
        )
        .then(res => {
          console.log(res.data)
            
            this.setState({
                address: res.data
            })
            
          })
        
  }

  detailAddress = () => {
    if (this.state.address[0] !== undefined) {
      const {
        provinsi,
        kabupaten,
        kecamatan,
        kelurahan
      } = this.state.address[0]
      var address = `${kelurahan}, ${kecamatan}, ${kabupaten}, ${provinsi}`
      return (
        <form className='input-group'>
          <input
            className='form-control'
            type='text'
            placeholder={address}
            disabled/>
        </form>
      )
    } else {
      return (
        <form className='input-group'>
          <input
            className='form-control'
            type='text'
            placeholder='Wilayah Sesuai Kode Pos'
            disabled/>
        </form>
      )
    }
  }

  render() {
    return (
        <div className='mt-5 row'>
        <div className='col-sm-6 col-md-3 mx-auto card'>
          <div className='card-body'>
            <div className='border-bottom border-secondary card-title'>
              <h1>Register</h1>
            </div>

            <div className='card-title mt-1'>
              <h4>Username</h4>
            </div>
            <form className='input-group'>
              <input ref={input => {this.username = input}} className='form-control' type='text'/>
              <p className='text-danger' style={{fontSize:25}}>*</p>
            </form>

            <div className='card-title mt-1'>
              <h4>Password</h4>
            </div>
            <form className='input-group'>
              <input ref={input => {this.password = input}} className='form-control' type='password'/>
              <p className='text-danger' style={{fontSize:25}}>*</p>
            </form>

            {/* <div className='card-title mt-1'>
                <h4>Confirm Password</h4>
                  </div>
                  <form className='input-group'>
                    <input ref={input => {this.repassword = input}} className='form-control' type='password'/>
                  </form> */}

            <div className='card-title mt-1'>
                <h4>Nama Depan</h4>
              </div>
              <form className='input-group'>
                <input ref={input => {this.firstname = input}} className='form-control' type='text'/>
                <p className='text-danger' style={{fontSize:25}}>*</p>
              </form>

              <div className='card-title mt-1'>
                <h4>Nama Belakang</h4>
              </div>
              <form className='input-group'>
                <input ref={input => {this.lastname = input }} className='form-control' type='text'/>
                <p className='text-danger' style={{fontSize:25}}>*</p>
              </form>

              <div className='card-title mt-1'>
                <h4>Email</h4>
              </div>
              <form className='input-group'>
                <input ref={input => {this.email = input}} className='form-control' type='email'/>
                <p className='text-danger' style={{fontSize:25}}>*</p>
              </form>
              <p><small id='emailHelp' className='form-text text-muted'>We'll never share your email with anyone else.</small></p>

              <div className='card-title mt-1'>
              <h4>Tanggal Lahir</h4>
              </div>
              <form className='input-group'>
                <input ref={input => {this.birthday = input}} className='form-control' type='date'/>
                <p className='text-danger' style={{fontSize:25}}>*</p>
              </form>

              <div className='card-title mt-1'>
              <h4>No. Telp atau HP</h4>
              </div>
              <form className='input-group'>
                <input ref={input => {this.phone_number = input }} className='form-control' type='text'/>
                <p className='text-danger' style={{fontSize:25}}>*</p>
              </form>

              <div className='card-title mt-1'>
              <h4>Alamat</h4>
              </div>
             <form className='input-group'>
              <textarea ref={input => { this.address = input}} className='form-control' type='text'/>
              <p className='text-danger' style={{fontSize:25}}>*</p>
              </form>

              <div className='card-title mt-1'>
              <h4>Kode Pos</h4>
              </div>
              <form className='input-group'>
                <div className='input-group search-box'>
                  <input type='text' ref={input => (this.searchKodepos = input)} className='form-control' placeholder='Ketik kode pos disini...'
                    onKeyUp={this.filterKodepos}/>
                  <span className='input-group-addon'>
                    <i className='fas fa-search' />
                  </span>
                </div>

              <select className='custom-select' ref={input => {this.kodepos = input}} onClick={this.filterAddress}>
                {this.selectKodepos()}
              </select>
            </form>

            <div className='card-title mt-1'>
            </div>
            {this.detailAddress()}
            <button className='btn btn-success btn-block mt-5' onClick={this.onRegisterClick}>
              Sign Up
            </button>
            {this.onErrorRegister()}
            {this.onRegSuccess()}
            {this.props.afterTwoSeconds()}
            <p className='lead'>
              Sudah punya akun? <Link to='/login'>Login</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    error: state.auth.error,
    success: state.auth.success,
    empty: state.auth.empty
  }
}

export default connect(
  mapStateToProps,
  { onRegister, afterTwoSeconds }
)(Register)
