import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import axios from '../../config/axios'

import ProductItems from './ProductItems'

class Home extends Component {
    state = {
        products: [],
        productSearch: [],
        part:[],
        list:false
    }

    componentDidMount() {
        this.getProduct()
        this.getPart()
    }

    getProduct = () => {
        axios.get('/products').then(res => {
            this.setState({ products: res.data, productSearch: res.data })
        })
    }

    getPart = async () => {
        await axios
          .get(`/part`)
          .then(res => {
            this.setState({ part: res.data })
          })
      }

    searchProduct = () => {
        const search = this.inputSearch.value
        const min = parseInt(this.minPrice.value)
        const max = parseInt(this.maxPrice.value) 

        var arrSearch = this.state.products.filter(item => {
            if (isNaN(min) && isNaN(max)) {
                // search hanya dengan name, min dan max kosong
                return item.product_name.toLowerCase().includes(search)
            } else if (isNaN(min)) {
                return (
                    item.product_name.toLowerCase().includes(search.toLowerCase()) &&
                    item.price <= max
                )
            } else if (isNaN(max)) {
                return (
                    item.product_name.toLowerCase().includes(search.toLowerCase()) &&
                    item.price >= min
                )
            } else {
                return (
                    item.product_name.toLowerCase().includes(search.toLowerCase()) &&
                    item.price <= max &&
                    item.price >= min
                )
            }
        })

        this.setState({ productSearch: arrSearch })
    }

    sortProduct = () => {
        const sort = this.sorting.value
        const namaAsc = this.namaAsc.value
        const namaDesc = this.namaDesc.value
        const priceAsc = this.priceAsc.value
        const priceDesc = this.priceDesc.value
        
        var arrSearch = this.state.products.sort((a, b) => {
            switch (sort) {
                case namaAsc:
                        if(a.product_name.toLowerCase() < b.product_name.toLowerCase()) return -1
                case namaDesc:
                        if(a.product_name.toLowerCase() < b.product_name.toLowerCase()) return 1
                case priceAsc:
                    return a.price - b.price
                case priceDesc:
                    return b.price - a.price
                default:
                    break
            }
        })
        this.setState({ productSearch: arrSearch })

    }

    renderList = () => {
        return this.state.productSearch.map(items => {
            return <ProductItems item={items} />
        })
    }
    renderPart = () => {
        return this.state.part.map(item => {
            return(
                <tr style={{fontSize:'18px', height:'40px'}} ><Link style={{color:'black'}} to={`/product/${item.name}`}> {item.name} </Link></tr>
            )
        })
    }


    listCategory = () => {
        return this.state.part.map(item => {
          return(
    <Link className='p-2 list-category' to={`/product/${item.name}`}>
      <span className='align-content-center text-dark lead'>{item.name}</span>
    </Link>
          )
        })
      }
    
    renderListCategory = () => {
        if(this.state.list){
            return (
              <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                <div className='container'>
                  <div className='navbar-nav d-flex flex-wrap'>
                    {this.listCategory()}
                  </div>
                </div>
              </nav>
            )
        }else{
          return null
        }
      }
    
    showCategory = () => {
        this.setState({list:!this.state.list})
      }


    render() {
        return (
            <div className='container'>
                <nav className='navbar navbar-expand-lg' style={{backgroundColor:'#f5f5f5'}}>
                    <div className='container'>
                    <div className='navbar-nav row w-100 m-1'>
                    <div className='col-md-6 col-sm-12 text-center text-md-left'>
                    <li className='nav-item'>
                    <Link className='mr-5 btn btn-transparent' to='/'>
                        <span>
                        <li class='far fa-list-alt' />
                        </span>
                    <span className='ml-1 align-content-center'>
                    Tampilkan Semua Produk
                    </span>
                    </Link>
                    </li>
                </div>
                <div className='col-md-6 col-sm-12 text-center text-md-right'>
                    <li className='nav-item'>
                    <button className='mr-5 btn btn-transparent' onClick={this.showCategory}>
                    <span className='mr-1 align-content-center text-dark '>
                    Kategori Produk
                    </span>
                        <span className='align-content-center'>
                        <i class='fas fa-caret-down' />
                        </span>
                    </button>
                    </li>
                </div>
                </div>
                </div>
                </nav>
            {this.renderListCategory()} 
                <div className='row mt-4'>
                    <div className='col-12'>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-sm-4 col-lg-3'>
                        <h4 className='display-8 text-center'>Filter</h4>
                        <div className='card p-1'>
                            <div className='card-header text-center'>Pencarian Produk</div>
                            <div className='card-body'>
                                <input ref={input => (this.inputSearch = input)}
                                    className='form-control my-2'
                                    placeholder='Cari produk...'
                                    onKeyUp={this.searchProduct}/>
                            </div>
                        </div>
                        <div className='card p-1'>
                            <div className='card-header text-center'>Urutkan</div>
                            <div className='card-body'>
                            <select ref={input => this.sorting = input} className='form-control' onChange={this.sortProduct}>
                                <option ref={input => this.namaAsc = input} value='namaAsc' className='text-center' onClick={this.sortProduct}>Name ↑</option>
                                <option ref={input => this.namaDesc = input} value='namaDesc' className='text-center' onClick={this.sortProduct}>Name ↓</option>
                                <option ref={input => this.priceAsc = input} value='priceAsc' className='text-center' onClick={this.sortProduct}>Price ↑</option>
                                <option ref={input => this.priceDesc = input} value='priceDesc' className='text-center' onClick={this.sortProduct}>Price ↓</option>
                            </select>
                            </div>
                        </div>
                        <div className='card p-1'>
                            <div className='card-header text-center'>Filter Harga</div>
                            <div className='card-body'>
                                <input ref={input => (this.minPrice = input)}
                                    type='number'
                                    className='form-control'
                                    placeholder='Min'
                                    onKeyUp={this.searchProduct} />
                                <h5 className='text-center'>⇌</h5>
                                <input ref={input => (this.maxPrice = input)}
                                    type='number'
                                    className='form-control'
                                    placeholder='Max'
                                    onKeyUp={this.searchProduct} />
                            </div>
                        </div>
                    </div>
                    <div className='row col-sm-8 col-lg-9'>{this.renderList()}</div>
                </div>
            </div>
        )
    }
}

export default Home
