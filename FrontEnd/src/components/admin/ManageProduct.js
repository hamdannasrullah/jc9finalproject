import React, { Component } from 'react'
import axios from '../../config/axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import cookies from 'universal-cookie'
import swal from 'sweetalert'

import '../style.css'
import '../styleSwitch.css'

const cookie = new cookies()

class ManageProduct extends Component {
  state = {
    product: [],
    productSearch: [],
    specification: [],
    brand: [],
    images: [],
    selectedID: 0,
    switch: true,
    switchEdit: true,
    selectedBrand: 0,
    selectedSpecification: 0
  }

  componentDidMount() {
    this.getProduct()
    this.getBrand()
    this.getSpecification()
    this.onGetBrand()
    this.onGetSpecification()
  }

  getProduct = async () => {
    await axios.get('/products').then(res => {
      this.setState({
        product: res.data,
        productSearch: res.data,
        selectedID: 0
      })
    })
  }

  getBrand = () => {
    axios.get('/brand').then(res => {
      this.setState({ brand: res.data })
    })
  }

  getSpecification = () => {
    axios.get('/specification').then(res => {
      this.setState({ specification: res.data })
    })
  }

  filterProduct = () => {
    const search = this.searchProduct.value
    var arrSearch = this.state.product.filter(item => {
      return item.product_name.toLowerCase().includes(search)
    })
    this.setState({ productSearch: arrSearch })
  }

  saveEdit = async id => {
    const formData = new FormData()
    const image = this.editImage.files[0]
    const name = this.editName.value
    const stock = this.editStock.value
    const price = this.editPrice.value
    const weight = this.editWeight.value
    const brand = this.selectedBrandId.value
    const specification = this.selectedSpecificationId.value

    formData.append('image', image)
    formData.append('product_name', name)
    formData.append('stock', stock)
    formData.append('price', price)
    formData.append('weight', weight)
    formData.append('brand', brand)
    formData.append('specification', specification)

    try {
      await axios.patch(`/products/edit/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      this.getProduct()
    } catch (err) {
      console.log(err)
    }
  }

  editProduct = id => {
    this.setState({ selectedID: id })
  }
  

  deleteProduct = (id) =>{
    axios.delete(`/products/${id}`).then(res=>{
        console.log(res)
        this.getProduct()
    })
  }

  onAddProduct = async () => {
    const formData = new FormData()
    const images = this.image.files[0]
    const name = this.name.value
    const stock = parseInt(this.stock.value)
    const price = parseInt(this.price.value)
    const weight = parseInt(this.weight.value)
    const brand = this.selectBrandId.value
    const specification = this.selectSpecificationId.value
    const description = this.description.value

    formData.append('images', images)
    formData.append('product_name', name)
    formData.append('stock', stock)
    formData.append('price', price)
    formData.append('weight', weight)
    formData.append('brand', brand)
    formData.append('specification', specification)
    formData.append('description', description)
    try {
      const res = await axios.post(
        `/products/add`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      swal({
        title:"Succes",
        text:"A Product Successfully Add!",
        icon:"success"
      })
      this.getProduct()
    } catch (err) {
      console.log('upload gagal' + err)
    }
  }

  selectBrand = () => {
    return this.state.brand.map(item => {
      return (
        <option key={item.id} value={item.id}>
          {item.brand_name}
        </option>
      )
    })
  }

  selectSpecification = () => {
    return this.state.specification.map(item => {
      return (
        <option key={item.id} value={item.id}>
          {item.specification_name}
        </option>
      )
    })
  }

  onGetBrand = () => {
    axios.get('/brand').then(res => {
      this.setState({ brand: res.data, selectedBrand: 0 })
    })
  }

  onGetSpecification = () => {
    axios.get('/specification').then(res => {
      this.setState({ specification: res.data, selectedSpecification: 0 })
    })
  }

  saveBrand = id => {
    const brand_name = this.editBrand.value
    axios
      .patch(`/brand/edit/${id}`, {
        brand_name
      })
      .then(() => {
        this.onGetBrand()
      })
  }

  deleteSpecification = (id) =>{
    axios.delete(`/specification/${id}`).then(res=>{
        console.log(res)
        this.getSpecification()
    })
  }

  deleteBrand = (id) =>{
    axios.delete(`/brand/${id}`).then(res=>{
        console.log(res)
        this.getBrand()
    })
  }

  saveSpecification = id => {
    const specification_name = this.editSpecification.value
    console.log(specification_name)
    axios
      .patch(`/specification/edit/${id}`, {
        specification_name
      })
      .then(() => {
        this.onGetSpecification()
      })
  }

  editBrandName = id => {
    this.setState({ selectedBrand: id })
  }

  editSpecificationName = id => {
    this.setState({ selectedSpecification: id })
  }

  onAddBrand = () => {
    const brand_name = this.brand.value
    this.addBrand(brand_name)
  }

  onAddSpecification = () => {
    const specification_name = this.specification.value
    this.addSpecification(specification_name)
  }

  addBrand = brand_name => {
    axios
      .post('/brand/add', {
        brand_name
      })
      .then(res => {
        swal({
          title:'Success',
          text:'Add brand name success!',
          icon:'success'
        })
        this.onGetBrand()
      })
  }

  addSpecification = specification_name => {
    axios
      .post('/specification/add', {
        specification_name
      })
      .then(res => {
        swal({
          title:'Success',
          text:'Add specification name Success!',
          icon:'success'
        })
        this.onGetSpecification()
      })
  }

  renderList = () => {
    return this.state.productSearch.map(item => {
      if (item.id !== this.state.selectedID) {
        return (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.product_name}</td>
            <td>{item.stock}</td>
            <td>{item.price}</td>
            <td>{item.weight}</td>
            <td>{item.brand_name}</td>
            <td>{item.specification_name}</td>
            <td>
              <img className='card-img-center img-thumbnail' className='list' src={item.image} alt={item.product_name} />
            </td>
            <td>
              <button className='btn btn-primary mr-2' onClick={() => { this.editProduct(item.id)}}>
                Edit
              </button>
              <button className='btn btn-primary mr-2' onClick={() => { this.deleteProduct(item.id)}}>
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
              <input className='form-control' ref={input => {this.editName = input}}
                type='text'
                defaultValue={item.product_name} />
            </td>
            <td>
              <input className='form-control' ref={input => {this.editStock = input}}
                type='number'
                defaultValue={item.stock || 0} />
            </td>
            <td>
              <input className='form-control' ref={input => {this.editPrice = input}}
                type='number'
                defaultValue={item.price || 0}/>
            </td>
            <td>
              <input className='form-control' ref={input => {this.editWeight = input }}
                type='number'
                defaultValue={item.weight || 0} />
            </td>
            <td>
              <select className='custom-select' ref={input => { this.selectedBrandId = input }}>
                <option selected hidden>
                  Choose
                </option>
                {this.selectBrand()}
              </select>
            </td>
            <td>
              <select className='custom-select' ref={input => { this.selectedSpecificationId = input }}>
                <option selected hidden>
                  Choose
                </option>
                {this.selectSpecification()}
              </select>
            </td>
            <td>
              <div className='custom-file'>
                <input className='custom-file-input' ref={input => { this.editImage = input }}
                  type='file'
                  id='customFile'/>
                <label class='custom-file-label' for='customFile' />
              </div>
            </td>
            <td>
              <button onClick={() => { this.saveEdit(item.id)}} className='btn btn-success mb-2'>
                Save
              </button>
              <button onClick={() => { this.setState({ selectedID: 0 }) }} className='btn btn-danger'>
                Cancel
              </button>
            </td>
          </tr>
        )
      }
    })
  }

  renderBrand = () => {
    return this.state.brand.map(item => {
      if (item.id !== this.state.selectedBrand) {
        return (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.brand_name}</td>
            <td>
              <button className='btn btn-primary mr-2' onClick={() => { this.editBrandName(item.id) }}>
                Edit
              </button>
              <button className='btn btn-primary mr-2' onClick={() => { this.deleteBrand(item.id)}}>
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
              <input className='form-control' ref={input => { this.editBrand = input }}
                type='text'
                defaultValue={item.brand_name}/>
            </td>
            <td className='d-flex flex-column'>
              <button onClick={() => { this.saveBrand(item.id) }} className='btn btn-success mb-2'>
                Save
              </button>
              <button onClick={() => {this.setState({ selectedBrand: 0 }) }} className='btn btn-danger'>
                Cancel
              </button>
            </td>
          </tr>
        )
      }
    })
  }
  
  renderSpecification = () => {
    return this.state.specification.map(item => {
      if (item.id !== this.state.selectedSpecification) {
        return (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.specification_name}</td>
            <td>
              <button className='btn btn-primary mr-2' onClick={() => {this.editSpecificationName(item.id)}}>
                Edit
              </button>
              <button className='btn btn-primary mr-2' onClick={() => { this.deleteSpecification(item.id)}}>
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
              <input className='form-control' ref={input => { this.editSpecification = input }}
                type='text'
                defaultValue={item.specification_name}/>
            </td>
            <td className='d-flex flex-column'>
              <button onClick={() => { this.saveSpecification(item.id) }}
                className='btn btn-success mb-2'>
                Save
              </button>
              <button onClick={() => { this.setState({ selectedSpecification: 0 }) }}
                className='btn btn-danger'>
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
          <h1 className='display-4 text-center'>Products</h1>
            <div
              className='container'
              style={{
                overflowY: 'scroll',
                overflowX: 'hidden',
                height: '700px'
              }}>
            
            <table className='table table-hover mb-5'>
              <ul className='nav nav-tabs' id='myTab' role='tablist'>
              <li className='nav-item'>
                  <a className='nav-link lead active'
                    id='home-tab'
                    data-toggle='tab'
                    href='#product'
                    role='tab'
                    aria-controls='home'
                    aria-selected='true'>
                    Product Table
                  </a>
                </li>
                <li className='nav-item'>
                  <a className='nav-link lead'
                    id='input-tab'
                    data-toggle='tab'
                    href='#inputproduct'
                    role='tab'
                    aria-controls='input'
                    aria-selected='false' >
                    Input Product
                  </a>
                </li>
                
                <li className='nav-item'>
                  <a className='nav-link lead'
                    id='brand-tab'
                    data-toggle='tab'
                    href='#tablebrand'
                    role='tab'
                    aria-controls='brand'
                    aria-selected='false' >
                    Brand Table
                  </a>
                </li>
                
                <li className='nav-item'>
                  <a className='nav-link lead'
                    id='spec-tab'
                    data-toggle='tab'
                    href='#tablespecification'
                    role='tab'
                    aria-controls='spec'
                    aria-selected='false' >
                    Specification Table
                  </a>
                </li>
              </ul>


              <div className='tab-content spec-tab' id='myTabContent'>
              <div className='tab-pane fade show active'
                  id='product'
                  role='tabpanel'
                  aria-labelledby='home-tab' >
                  <h4 className='text-center'>Product Table</h4>
                  <div className='input-group search-box'>
                    <input type='text' ref={input => (this.searchProduct = input)} className='form-control'
                      placeholder='Search Product here...'
                      onKeyUp={this.filterProduct}/>
                    <span className='input-group-addon'>
                      <i className='fas fa-search' />
                    </span>
                  </div>
                  <table className='table text-left table-hover mb-5'>
                    <thead>
                      <tr>
                        <th scope='col'>ID</th>
                        <th scope='col'>NAME</th>
                        <th scope='col'>STOCK</th>
                        <th scope='col'>PRICE</th>
                        <th scope='col'>WEIGHT</th>
                        <th scope='col'>BRAND</th>
                        <th scope='col'>SPECIFICATION</th>
                        <th scope='col'>IMAGE</th>
                        <th scope='col'>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>{this.renderList()}</tbody>
                  </table>
                </div>

                <div className='tab-pane fade'
                  id='inputproduct'
                  role='tabpanel'
                  aria-labelledby='input-tab' >
                  <h4 className='text-center'>Input Product</h4>
                  <table className='table text-left'>
                    <tbody>
                      <tr>
                        <th scope='col'>NAME</th>
                        <th scope='col'>
                          <input ref={input => (this.name = input)}
                            className='form-control'
                            type='text'
                            placeholder='Product Name'/>
                        </th>
                      </tr>

                      <tr>
                        <th scope='col'>STOCK</th>
                        <th scope='col'>
                          <input ref={input => (this.stock = input)}
                            className='form-control'
                            type='text'
                            placeholder='pcs'/>
                        </th>
                      </tr>

                      <tr>
                        <th scope='col'>PRICE</th>
                        <th scope='col'>
                          <input ref={input => (this.price = input)}
                            className='form-control'
                            type='text'
                            placeholder='Rp'/>
                        </th>
                      </tr>

                      <tr>
                        <th scope='col'>WEIGHT</th>
                        <th scope='col'>
                          <input ref={input => (this.weight = input)}
                            className='form-control'
                            type='text'
                            placeholder='kg' />
                        </th>
                      </tr>

                      <tr>
                        <th scope='col'>BRAND</th>
                        <th>
                          <select className='select-custom form-control' 
                          ref={input => { this.selectBrandId = input }}>
                            {this.selectBrand()}
                          </select>
                        </th>
                      </tr>

                      <tr>
                        <th scope='col'>SPECIFICATION</th>
                        <th>
                          <select
                            className='select-custom form-control'
                            ref={input => { this.selectSpecificationId = input }} >
                            {this.selectSpecification()}
                          </select>
                        </th>
                      </tr>

                      <tr>
                        <th scope='col'>DESCRIPTION</th>
                        <textarea
                          type='text' 
                          className='form-control'
                          ref={input => { this.description = input }} />
                      </tr>

                      <tr>
                        <th scope='col'>IMAGE</th>
                        <th scope='row'>
                          <div className='custom-file'>
                            <input
                              type='file'
                              id='myfile'
                              ref={input => (this.image = input)}
                              className='custom-file-input' />
                            <label className='custom-file-label' />
                          </div>
                        </th>
                      </tr>
                    </tbody>
                  </table>

                  <div class='d-flex justify-content-center'>
                  <tr>
                      <button className='btn btn-success' 
                      onClick={this.onAddProduct}>
                      Add
                      </button>
                  </tr>
                  </div>
                </div>
                
                <div
                  className='tab-pane fade'
                  id='tablebrand'
                  role='tabpanel'
                  aria-labelledby='brand-tab'>
                    <table className='table table-hover mb-5'>
                      <thead>
                        <tr>
                          <th scope='col'>ID</th>
                          <th scope='col'>NAME</th>
                          <th scope='col'>ACTION</th>
                        </tr>
                      </thead>
                      <tr>
                          <th scope='col'>ID</th>
                          <th scope='col'>
                            <input ref={input => (this.brand = input)}
                              className='form-control'
                              type='text' />
                          </th>
                          <th scope='col'>
                            <button className='btn btn-success'
                              onClick={this.onAddBrand}>
                              Add
                            </button>
                          </th>
                        </tr>
                      <tbody>{this.renderBrand()}</tbody>
                    </table>
                </div>


                <div
                  className='tab-pane fade'
                  id='tablespecification'
                  role='tabpanel'
                  aria-labelledby='brand-tab' >
                    <table className='table table-hover mb-5'>
                      <thead>
                        <tr>
                          <th scope='col'>ID</th>
                          <th scope='col'>NAME</th>
                          <th scope='col'>ACTION</th>
                        </tr>
                      </thead> 
                      <tr>
                        <th scope='col'>ID</th>
                        <th scope='col'>
                          <input ref={input => (this.specification = input)}
                            className='form-control'
                            type='text'/>
                        </th>
                        <th scope='col'>
                          <button onClick={this.onAddSpecification}
                            className='btn btn-success'>
                            Add
                          </button>
                        </th>
                      </tr>
                      <tbody>{this.renderSpecification()}</tbody>
                    </table>
                </div>
              </div>
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

export default connect(mapStateToProps)(ManageProduct)
