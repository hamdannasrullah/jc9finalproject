import React, { Component } from 'react'
import axios from '../../config/axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import cookies from 'universal-cookie'
import '../style.css'

const cookie = new cookies()

class ManageBank extends Component {
  state = {
    edit: true,
    bank: [],
    selectedBank: 0
  }

  componentDidMount() {
    this.getBank()
  }

  getBank = () => {
    axios.get('/bank').then(res => {
      this.setState({ bank: res.data, selectedBrand: 0 })
    })
  }

  saveBank = (id) => {
    const kode_bank = this.editKodeBank.value
    const bank_name = this.editNamaBank.value
    const no_rek = this.editNoRek.value
    axios.patch(`/bank/edit/${id}`, {
        kode_bank,bank_name,no_rek
    }).then(() => {
        this.getBank()
    })
}
  
  editBank = (id) => {
      this.setState({ selectedBank: id })
  }
 
  onAddBank = () => {
    const kode_bank = this.kode_bank.value
    const bank_name = this.nama_bank.value
    const no_rek = this.no_rek.value
    this.addBank(kode_bank, bank_name, no_rek)

  }
  
  addBank = (kode_bank, bank_name, no_rek) => {
    axios.post('/bank/add', {
      kode_bank, bank_name, no_rek
    }).then(res => {
      console.log(res)
          this.getBank()
      })
  }
 
  renderBank = () => {
    return this.state.bank.map(item => {
      if (item.id !== this.state.selectedBank) {
        return (
          <tr key={item.id}>
            <td>{item.kode_bank}</td>
            <td>{item.bank_name}</td>
            <td>{item.no_rek}</td>
            <td>
              <button className='btn btn-primary mr-2' onClick={() => { this.editBank(item.id) }}>
                Edit
              </button>
            </td>

          </tr>
        )
      } else {
        return (
          <tr key={item.id}>
            <td>
              <input className='form-control' ref={input => {this.editKodeBank = input}} type='text' defaultValue={item.kode_bank}/>
            </td>
            <td>
              <input className='form-control' ref={input => {this.editNamaBank = input}} type='text' defaultValue={item.bank_name}/>
            </td>
            <td>
              <input  className='form-control' ref={input => {this.editNoRek = input}} type='text' defaultValue={item.no_rek}/>
            </td>
            <td className='d-flex flex-column'>
              <button onClick={() => { this.saveBank(item.id)}} className='btn btn-success mb-2'>
                Save
              </button>
              <button onClick={() => { this.setState({ selectedBank: 0 })}}className='btn btn-danger'>
                Cancel
              </button>
            </td>
          </tr>
        )
      }
    })
  }
  

  render() {
    var userCookie = cookie.get('stillLogin')

    if (userCookie === undefined ) {
      return (
        <Redirect to='/admin/login' />
      ) 
    } else{
      return (
        <div id='page-wrap'>
            <div className='container'>
            <h1 className='display-4 text-center'>Rekening Bank</h1>
              <table className='table table-hover mb-5'>
                <thead>
                  <tr>
                    <th scope='col'>Kode Bank</th>
                    <th scope='col'>Nama Bank</th>
                    <th scope='col'>Nomor Rekening</th>
                    <th scope='col'>ACTION</th>
                  </tr>
                </thead>
                <tbody>{this.renderBank()}</tbody>
                    <th scope='col'>
                      <input ref={input => (this.kode_bank = input)} className='form-control' type='text'/>
                    </th>
                    <th scope='col'>
                      <input ref={input => (this.nama_bank = input)} className='form-control' type='text'/>
                    </th>
                    <th scope='col'>
                      <input ref={input => (this.no_rek = input)} className='form-control' type='text' />
                    </th>
                    <th scope='col'>
                      <button className='btn btn-success' onClick={this.onAddBank} >
                        Add
                      </button>
                  </th>
              </table>
            </div>
        </div>
      )
    } 
  }
}

const mapStateToProps = state => {
  return { user: state.auth }
}

export default connect(mapStateToProps)(ManageBank)
