import React, { Component } from 'react'
import axios from '../../config/axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import cookies from 'universal-cookie'
import swal from 'sweetalert'

import '../style.css'

const cookie = new cookies()

class ManagePart extends Component {
  state = {
    part: [],
    partSearch: [],
    partProduct: [],
    partProductSearch: [],
    partUser: [],
    partUserSearch: [],
    products: [],
    selectedPart: 0,
    selectedProduct: 0
  }

  componentDidMount() {
    this.getProduct()
    this.getPart()
    this.onGetPart()
    this.getPartProduct()
  }

  getProduct = async () => {
    await axios.get('/products').then(res => {
      this.setState({ products: res.data })
    })
  }

  getPart = () => {
    axios.get('/part').then(res => {
      this.setState({ part: res.data })
    })
  }

  getPartProduct = async () => {
    await axios.get('/partproducts').then(res => {
      this.setState({
        partProduct: res.data,
        partProductSearch: res.data,
        selectedProduct: 0
      })
    })
  }

  savePart = id => {
    const name = this.editPart.value
    axios
      .patch(`/part/edit/${id}`, {
        name
      })
      .then(() => {
        this.onGetPart()
      })
  }

  deletePart = (id) =>{
    axios.delete(`/part/${id}`).then(res=>{
        console.log(res)
        this.getPart()
    })
  }

  savePartPro = id => {
    const productId = parseInt(this.selectProductId.value)
    const partId = parseInt(this.selectPartId.value)
    console.log(productId)
    console.log(partId)
    axios
      .patch(`/partproducts/edit/${id}`, {
        product_id: productId,
        part_id: partId
      })
      .then(() => {
        this.getPartProduct()
      })
  }
  editPart = id => {
    this.setState({ selectedPart: id })
  }
  editPartProduct = id => {
    this.setState({ selectedProduct: id })
  }

  editPartName = id => {
    this.setState({ selectedBrand: id })
  }


  onGetPart = () => {
    axios.get('/part').then(res => {
      this.setState({ part: res.data, selectedPart: 0 })
    })
  }

  addPart = name => {
    axios
      .post('/part/add', {
        name
      })
      .then(res => {
        swal({
          title:'Success',
          text:'Add Part Category success!',
          icon:'success'
        })
        this.onGetPart()
      })
  }

  addPartProduct = (product_id, part_id) => {
    axios
      .post(`/product/addpart`, {
        product_id,
        part_id
      })
      .then(res => {
        console.log(res)
        this.getPartProduct()
      })
  }

  onAddPart = () => {
    const part_name = this.part.value
    this.addPart(part_name)
  }

  onAddPartProduct = () => {
    const part_id = parseInt(this.PartId.value)
    const product_id = parseInt(this.ProductId.value)
    console.log(part_id,product_id)
    this.addPartProduct(product_id, part_id)
  }

  selectPart = () => {
    return this.state.part.map(item => {
      return (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      )
    })
  }

  selectProduct = () => {
    return this.state.products.map(item => {
      return (
        <option key={item.id} value={item.id}>
          {item.product_name}
        </option>
      )
    })
  }

  filterPart = () => {
    const search = this.searchPart.value
    console.log(search)
    var arrSearch = this.state.part.filter(item => {
      return item.name.toLowerCase().includes(search.toLowerCase())
    })
    this.setState({ partSearch: arrSearch })
  }
  filterPartProduct = () => {
    const search = this.searchPartProduct.value
    var arrSearch = this.state.partProduct.filter(item => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.product_name.toLowerCase().includes(search.toLowerCase())
      )
    })
    this.setState({ partProductSearch: arrSearch })
  }

  renderPart = () => {
    return this.state.part.map(item => {
      if (item.id !== this.state.selectedPart) {
        return (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>
              <button className='btn btn-primary mr-2' onClick={() => { this.editPart(item.id) }} >
                Edit
              </button>
              <button className='btn btn-primary mr-2' onClick={() => { this.deletePart(item.id) }} >
                Delete
              </button>
            </td>
          </tr>
        )
      } else {
        return (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>
              <input className='form-control' ref={input => { this.editPart = input}} type='text' defaultValue={item.name}/>
            </td>
            <td>
              <button onClick={() => { this.savePart(item.id) }} className='btn btn-success mb-2'>
                Save
              </button>
            </td>
            <td>
              <button onClick={() => { this.setState({ selectedPart: 0 })}} className='btn btn-danger'>
                Cancel
              </button>
            </td>
          </tr>
        )
      }
    })
  }
  renderPartProduct = () => {
    return this.state.partProductSearch.map(item => {
      if (item.id !== this.state.selectedProduct) {
        return (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.product_name}</td>
            <td>{item.name}</td>
            <td>
              <button className='btn btn-primary mr-2' onClick={() => { this.editPartProduct(item.id)}}>
                Edit
              </button>
            </td>
          </tr>
        )
      } else {
        return (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>
              <select className='form-control' ref={input => { this.selectProductId = input }}>
                {this.selectProduct()}
              </select>
            </td>
            <td>
              <select className='form-control' ref={input => { this.selectPartId = input }}>
                {this.selectPart()}
              </select>
            </td>
            <td>
              <button onClick={() => { this.savePartPro(item.id)}} className='btn btn-success mb-2'>
                Save
              </button>
              </td>
              <td>
              <button onClick={() => { this.setState({ selectedProduct: 0 })}} className='btn btn-danger'>
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
    if (userCookie === undefined) {
      return <Redirect to='/admin/login' />
    } else {
      return (
          <div id='page-wrap'>
        <h1 className='display-4 text-center'>Product Part</h1>
            <div
              className='container'
              style={{
                overflowY: 'scroll',
                overflowX: 'hidden',
                height: '700px'
              }}
            >
              <ul className='nav nav-tabs' id='myTab' role='tablist'>
                <li className='nav-item'>
                  <a
                    className='nav-link lead active'
                    id='home-tab'
                    data-toggle='tab'
                    href='#part'
                    role='tab'
                    aria-controls='home'
                    aria-selected='true'
                  >
                    Part Table
                  </a>
                </li>
                <li className='nav-item'>
                  <a
                    className='nav-link lead'
                    id='profile-tab'
                    data-toggle='tab'
                    href='#partproduct'
                    role='tab'
                    aria-controls='profile'
                    aria-selected='false'
                  >
                    Product Part Table
                  </a>
                </li>
                <li className='nav-item'>
                  <a
                    className='nav-link lead'
                    id='profile-tab'
                    data-toggle='tab'
                    href='#partuser'
                    role='tab'
                    aria-controls='profile'
                    aria-selected='false'
                  >
                  </a>
                </li>
              </ul>

              <div className='tab-content profile-tab' id='myTabContent'>
                <div
                  className='tab-pane fade show active'
                  id='part'
                  role='tabpanel'
                  aria-labelledby='home-tab'
                >
                  <h4 className='text-center'>Part</h4>
                  <div className='input-group search-box'>
                    <input type='text' ref={input => (this.searchPart = input)} className='form-control'
                      placeholder='Search Part here...'
                      onKeyUp={this.filterPart}
                    />
                    <span className='input-group-addon'>
                      <i className='fas fa-search' />
                    </span>
                  </div>
                  
                  
                  <table className='table table-hover mb-5'>
                    <thead>
                      <tr>
                        <th scope='col'>ID</th>
                        <th scope='col'>NAME</th>
                        <th scope='col'>ACTION</th>
                      </tr>
                    </thead>
                    

                    <tbody>
                      <tr>
                        <th scope='col'>ID</th>
                        <th scope='col'>
                          <input ref={input => (this.part = input)} className='form-control' type='text'/>
                        </th>
                        <th scope='col'>
                          <button className='btn btn-success' onClick={this.onAddPart}>
                            Add
                          </button>
                        </th>
                      </tr>
                    </tbody>
                    <tbody>{this.renderPart()}</tbody>
                  </table>
                </div>

                <div
                  className='tab-pane fade'
                  id='partproduct'
                  role='tabpanel'
                  aria-labelledby='home-tab'
                >
                  <h4 className='text-center'>Product Part</h4>
                  <div className='input-group search-box'>
                    <input type='text' ref={input => (this.searchPartProduct = input)} className='form-control'
                      placeholder='Search Product Part here...'
                      onKeyUp={this.filterPartProduct}
                    />
                    <span className='input-group-addon'>
                      <i className='fas fa-search' />
                    </span>
                  </div>
                  <table className='table table-hover mb-5'>
                    <thead>
                      <tr>
                        <th scope='col'>ID</th>
                        <th scope='col'>PRODUCT</th>
                        <th scope='col'>PART</th>
                        <th scope='col'>ACTION</th>
                      </tr>
                    </thead>

                    <tr>
                    <th scope='col'>ID</th>
                        <th scope='col'>
                          <select className='form-control' type='text' ref={input => { this.ProductId = input}}>
                            {this.selectProduct()}
                          </select>
                        </th>
                        <th scope='col'>
                          <select className='form-control' type='text' ref={input => { this.PartId = input}}>
                            {this.selectPart()}
                          </select>
                        </th>
                        <th scope='col'>
                          <button className='btn btn-success' onClick={this.onAddPartProduct}>
                            Add
                          </button>
                        </th>
                      </tr>
                    <tbody>{this.renderPartProduct()}</tbody>
                  </table>
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

export default connect(mapStateToProps)(ManagePart)
