import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import axios from '../../config/axios'
import cookies from 'universal-cookie'
import { onEdit } from '../../actions'
import {Link} from 'react-router-dom'
import swal from 'sweetalert'

const cookie = new cookies()

class PasswordUpdate extends Component {
  cardheader = {
    backgroundColor: '#d3d3d3'
  }
  state = {
    edit: true,
    data: undefined,
    password: []
  }

  componentDidMount() {
    const userid = cookie.get('idLogin')
    this.getProfile(userid)

  }
  getProfile = async userid => {
    try {
      const res = await axios.get(
        `/users/profile/${userid}`
      )
      
      cookie.set('avatar', res.data.photo, {path: '/'})
      this.setState({
        data: res.data
      })
    } catch (err) {
      console.log(err)
    }
  }

  updatePassword = userid => {
    const password = this.passwordOld.value
    const newpass = this.passwordNew.value
    const confirmpass = this.passwordConfirm.value

    axios.patch(`/password/${userid}`,{
      password,newpass,confirmpass
    }).then(res => {
      swal({
        title:'Success',
        text:'Password Anda telah berhasil dirubah!',
        icon:'success'
      })
      this.setState({
        edit:!this.state.edit
      })
    },err => {
      console.log(err.response)
      
    })
  }

  privacy = () => {
    if(this.state.edit){
      return(
      <div className='card-body p-5'>
        <p className='lead'> Password </p>
        <p className='font-weight-bold' style={{fontSize:'10px'}}>
        <i class='fas fa-circle'></i>{' '}
        <i class='fas fa-circle'></i>{' '}
        <i class='fas fa-circle'></i>{' '}
        <i class='fas fa-circle'></i>{' '}
        <i class='fas fa-circle'></i>{' '}
        <i class='fas fa-circle'></i>{' '}
        <i class='fas fa-circle'></i>{' '}
        <i class='fas fa-circle'></i>{' '}
        </p>
        <p><button className='btn btn-success ' onClick={() => {this.setState({edit:!this.state.edit})}}>Ganti Password</button></p>
      </div>
      
      )
      }else{
        return(
        <div className='card-body p-5'>
        <p className='lead'> Password Anda </p>
        <input className='form-control' type='password' ref={input => {this.passwordOld = input}} />
        <p className='lead'> Password Baru Anda </p>
        <input className='form-control' type='password' ref={input => {this.passwordNew = input}} />
        <p className='lead'> Masukkan Password Baru Anda </p>
        <input className='form-control' type='password' ref={input => {this.passwordConfirm = input}} />
        <div className='d-flex justify-content-center'>
        <button className='btn btn-outline-primary' onClick={() => {this.updatePassword(cookie.get('idLogin'))}}>Save</button>
        <button className='btn btn-outline-primary' onClick={() => {this.setState({ edit: !this.state.edit })}}>Cancel</button>
        </div>
      </div>
        )
    }
  }


  render() {
    
    if (cookie.get('stillLogin')) {
      if (this.state.data !== undefined) {          
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

                  <div className='card-header' style={this.cardheader}>
                    <Link to='/passwordupdate' className='text-dark'>
                      <p className='lead text-center'>Password Update</p>
                    </Link>
                  </div>

                  <div className='card-header'>
                    <Link to='/addresscontact' className='text-dark'>
                      <p className='lead text-center'>
                        Alamat dan <p>Informasi Kontak</p> 
                      </p>
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
                      <h4>Password</h4>
                    
                      </div>
                    </div>
                    {this.privacy()}
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

export default connect (mapStateToProps, {onEdit})(PasswordUpdate)
