import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from '../../config/axios'
import cookies from 'universal-cookie'
import { onEdit } from '../../actions'
import { Link } from 'react-router-dom'
import image from '../../img/avatar2.jpg'
import swal from 'sweetalert'


const cookie = new cookies()

// Moment: A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
var moment = require('moment')

class Profile extends Component {
  cardheader = {
    backgroundColor: '#d3d3d3'
  }
  state = {
    edit: true,
    data: undefined,
    kodepos:[]
  }

  saveProfile = async id => {
    const firstname = this.firstname.value
    const lastname = this.lastname.value
    const username = this.username.value
    const address = this.address.value
    const email = this.email.value
    const birthday = this.birthday.value
    await this.props.onEdit(
      id,
      firstname,
      lastname,
      username,
      birthday,
      address,
      email
    )
    await this.getProfile(id)
    this.setState({ edit: !this.state.edit })
  }

  uploadAvatar = async userid => {
    const formData = new FormData()
    var imagefile = this.gambar

    formData.append('avatar', imagefile.files[0])
    try {
      await axios.post(
        `/avatar/uploads/${userid}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      swal({
        title:'Success',
        text:'Foto profil Anda berhasil dirubah!',
        icon:'success'
      })
      this.getProfile(userid)

    } catch (err) {
      console.log('upload gagal' + err)
    }
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

  profile = () => {
    const {username,firstname,lastname,age,id,email,address,birthday} = this.state.data.user
    var birth = moment(birthday)
    var date = birth.utc().format('YYYY-MM-DD')

    if (this.state.edit) {
      return (
        <div>
          <div className='card-body'>
            <li className='list-group-item pl-1'><p className='font-weight-bold'>Username: </p><p className='lead '>{username}</p></li>
            <li className='list-group-item pl-1'><p className='font-weight-bold'>Email: </p><p className='lead '>{email}</p></li>
            <li className='list-group-item pl-1'><p className='font-weight-bold'>Nama Depan: </p><p className='lead '>{firstname}</p></li>
            <li className='list-group-item pl-1'><p className='font-weight-bold'>Nama Belakang: </p><p className='lead '>{lastname}</p></li>
            <li className='list-group-item pl-1'><p className='font-weight-bold'>Umur: </p><p className='lead '>{age}</p></li>
            <li className='list-group-item pl-1'><p className='font-weight-bold'>Alamat: </p><p className='lead '>{address}</p></li>
          </div>

          <div className='card-footer'>
            <div className='d-flex justify-content-between'>
              <button onClick={() => {this.setState({ edit: !this.state.edit })}}
                className='btn btn-success'>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div >
            <li className='list-group-item pl-1'><p className='font-weight-bold'>Username: </p><p className='lead '>{username}</p></li>
            <li className='list-group-item pl-1'><p className='font-weight-bold'>Email: </p><p className='lead '>{email}</p></li>

            <li className='list-group-item pl-1'><p className='font-weight-bold'>Nama Depan: </p><p className='lead '>
            <input
            type='text'
            className='form-control'
            placeholder='Nama Depan...'
            ref={input => {this.firstname = input}}
            defaultValue={firstname}/></p>
            </li>

            <li className='list-group-item pl-1'><p className='font-weight-bold'>Nama Belakang: </p><p className='lead '>
            <input
            type='text'
            className='form-control'
            placeholder='Nama Depan...'
            ref={input => {this.lastname = input}}
            defaultValue={lastname}/></p>
            </li>

            <li className='list-group-item pl-1'><p className='font-weight-bold'>Tanggal Lahir: </p><p className='lead '>
            <input
            type='date'
            className='form-control'
            placeholder='Tanggal Lahir...'
            ref={input => { this.birthday = input }}
            defaultValue={date} /></p>
            </li>

            <li className='list-group-item pl-1'><p className='font-weight-bold'>Alamat: </p><p className='lead '>
            <input
            type='textarea'
            className='form-control'
            placeholder='Alamat...'
            ref={input => { this.address = input }}
            defaultValue={address} /></p>
            </li>

            <li className='list-group-item px-0'><div className='d-flex justify-content-center'>
            <button
              onClick={() => { this.saveProfile(id) }}
              className='btn btn-outline-primary'>
              Save
            </button>

            <button
              onClick={() => { this.setState({ edit: !this.state.edit })}}
              className='btn btn-outline-primary'>
              Cancel
            </button>
          </div>
        </li>
      </div>
    )
  }

  profilePicture = () => {
    if (this.state.data.user.avatar !== null) {
      return (
        <img
          src={this.state.data.photo}
          alt={this.state.data.user.username}
          key={new Date()}
          className='card-img-top'/>
      )
    }
    return (
      <img
        src={image}
        alt='avatar'
        key={new Date()}
        className='card-img-top'/>
      )
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
                  <div className='card-header' style={this.cardheader}>
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

              <div className='col-9'>
                <div className='card py-1'>
                  <div className='row'>
                    <div className='col-8'>
                      <ul className='list-group list-group-flush'>
                        <div className='card-header'>
                          <p className='lead text-center'>
                            User's Information
                          </p>
                        </div>
                        {this.profile()}
                      </ul>
                    </div>

                    <div className='col-4'>
                      <div className='card-header'>
                        <p className='lead text-center'>
                          Profile Picture
                        </p>
                      </div>

                      <div className='card-body'>
                        {this.profilePicture()}
                        <div className='custom-file'>
                          <input
                            type='file'
                            id='myfile'
                            ref={input => (this.gambar = input)}
                            className='custom-file-input'/>
                          <label
                            className='custom-file-label'
                            for='myfile'>
                            choose image
                          </label>
                        </div>

                        <div className='d-flex justify-content-between py-2'>
                          <p/>
                          <button className='btn btn-primary' 
                            onClick={() => this.uploadAvatar(this.props.user.id)} >
                            Upload
                          </button>
                        </div>
                      </div>
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

export default connect(mapStateToProps, {onEdit})(Profile)
