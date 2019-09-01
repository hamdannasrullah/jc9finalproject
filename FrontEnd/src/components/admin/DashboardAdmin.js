import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import axios from '../../config/axios'
import cookies from 'universal-cookie'
import { onEdit } from '../../actions'
import image from '../../img/avatar2.jpg'
import swal from 'sweetalert'

import '../style.css'

const cookie = new cookies()

var moment = require('moment')

class DashboardAdmin extends Component {
  state = {
    edit: true,
    data:undefined,
    photo:undefined
  }
  saveProfile = async id => {
    const firstname = this.firstname.value
    const lastname = this.lastname.value
    const username = this.username.value
    const address = this.address.value
    const email = this.email.value
    const birthday = this.birthday.value
    await this.props.onEdit(id,firstname, lastname, username,birthday,address,email)
    await this.getProfile(id)
    this.setState({ edit: !this.state.edit })
  }

  uploadAvatar = async (userid) => {
    const formData = new FormData()
    var imagefile = this.gambar

    formData.append('avatar', imagefile.files[0])
    try {
      await axios.post(`/avatar/uploads/${userid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      this.getProfile(userid)
      swal({
        title:'Upload foto sukses!',
        text:'Foto profil berhasil diubah!',
        icon:'success'
      })
    } catch (err) {
      console.log('upload gagal' + err)
    }
  }

  componentDidMount() {
    const userid = cookie.get('idLogin')
    this.getProfile(userid)
  }

  handleChange = event => {
    this.setState({
      photo : URL.createObjectURL(event.target.files[0])
    })
  }

  getProfile = async (userid) => {
    try {
        const res = await axios.get(`/users/profile/${userid}`)
        console.log(res.data)
        
        this.setState({
          data: res.data,
          photo:res.data.photo
        })
        
    } catch (err) {
      console.log(err)
    }
  }

  profile = () => {
    const { username, firstname, lastname, age, id , email,address,birthday} = this.state.data.user
    var birth = moment(birthday)
    var date = birth.utc().format('DD-MM-YYYY')
    
    if (this.state.edit) {
      return (
        <div >
          <div class='card-body'>
          <li className='list-group-item pl-1'><p className='font-weight-bold'>Admin Name: </p><p className='lead '>{username}</p></li>
            <li className='list-group-item pl-1'><p className='font-weight-bold'>Email: </p><p className='lead '>{email}</p></li>
            <li className='list-group-item pl-1'><p className='font-weight-bold'>Nama Depan: </p><p className='lead '>{firstname}</p></li>
            <li className='list-group-item pl-1'><p className='font-weight-bold'>Nama Belakang: </p><p className='lead '>{lastname}</p></li>
            <li className='list-group-item pl-1'><p className='font-weight-bold'>Umur: </p><p className='lead '>{age} tahun</p></li>
            <li className='list-group-item pl-1'><p className='font-weight-bold'>Alamat: </p><p className='lead '>{address}</p></li>
          </div>
          <div class='card-footer'>
            <div class='d-flex justify-content-between'>
              <button onClick={() => {this.setState({ edit: !this.state.edit })}} className='btn btn-success'>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        <li class='list-group-item pl-1'><p className='font-weight-bold'>Admin Name: </p>
          <input type='text' class='form-control' ref={input => { this.username = input }} defaultValue={username} />
        </li>
        <li class='list-group-item pl-1'><p className='font-weight-bold'>Email: </p>
          <input type='text' class='form-control' ref={input => { this.email = input }} defaultValue={email} />
        </li>
        <li class='list-group-item pl-1'><p className='font-weight-bold'>Nama Depan: </p>
          <input type='text' class='form-control' ref={input => { this.firstname = input }} defaultValue={firstname}/>
        </li>
        <li class='list-group-item pl-1'><p className='font-weight-bold'>Nama Belakang: </p>
          <input type='text' class='form-control' ref={input => { this.lastname = input }} defaultValue={lastname} />
        </li>
        <li class='list-group-item pl-1'><p className='font-weight-bold'>Tanggal Lahir: </p>
          <input type='date' class='form-control' ref={input => { this.birthday = input }} defaultValue={date} />
        </li>
        <li class='list-group-item pl-1'><p className='font-weight-bold'>Alamat: </p>
          <input type='text' class='form-control' ref={input => { this.address = input }} defaultValue={address} />
        </li>
        <li class='list-group-item px-0'>
          <div class='d-flex justify-content-center'>
            <button onClick={() => { this.saveProfile(id) }} className='btn btn-outline-primary' >
              Save
            </button>
            <button onClick={() => { this.setState({edit: !this.state.edit})}} className='btn btn-outline-primary' >
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
          className='card-img-top'
        />
      )
    }
    return (
      <img
        src={image}
        alt='avatar'
        key={new Date()}
        className='card-img-top'
      />
    )
  }

  render() {
    if(this.props.user.role === 1){
      if(this.state.data !== undefined){
        return (
          <div className='container'>
          <div className='col-9'>
                <div className='card py-1'>
              <div className='row'>
                <div className='col-8'>
                  <ul className='list-group list-group-flush'>
                    <div className='card-header'>
                      <p className='lead text-center'>
                        Informasi Admin
                      </p>
                    </div>
                    {this.profile()}
                  </ul>
                </div>
                <div className='col-4'>
                  <div className='card-header'>
                    <p className='lead text-center'>
                      Foto Profil
                    </p>
                  </div>
                  <img src={this.state.photo} alt={this.state.data.user.username} key={new Date()} className='card-img-top' style={{height:'250px'}} />
                    <div class='card-body'>
                      <div className='custom-file'>
                        <input
                          type='file'
                          id='myfile'
                          ref={input => (this.gambar = input)}
                          className='custom-file-input'
                          onChange={this.handleChange}
                        />
                        <label className='custom-file-label' for='myfile'>Choose Image</label>
                      </div>
                    <div className='d-flex justify-content-between py-2'>
                      <p />
                      <button className='btn btn-primary' onClick={() => this.uploadAvatar(this.props.user.id)}>
                          Upload
                        </button>
                    </div>
                  </div>
                </div>
              </div>
              </div></div></div>
        )
  
      }else{
        return(
          <h1>Loading</h1>
          )
        }
        
      }else{
      return <Redirect to='/admin/login' />
      }
    
    
  }
}

const mapStateToProps = state => {
  return { user: state.auth }
}

export default connect(
  mapStateToProps,
  {onEdit}
)(DashboardAdmin)
