import React,{Component} from 'react'
import '../footer.css'
// import image from '../../img/logo_footer.jpg'

class Footer extends Component{
    render(){
        const date = new Date()
        return(
                <div className='row bg-dark justify-content-md-center mr-0 mt-5 p-4'>
        	    <div className='getHelp col-2 mt-4'>
                {/* <p><img className='card-img-top img-thumbnail rounded rounded-circle logo' src={image} /></p> */}
                <h2><i className="fas fa-desktop"></i> KOMPIPEDIA</h2>
                <p>© {date.getFullYear()} All rights reserved</p>
                <p>Kami menghadirkan produk komputer dan elektronik dari merek ternama. Dengan mengedepankan kualitas produk, layanan penjualan serta after-sales service. Didukung staf yang berpengalaman dalam memberikan rekomendasi produk sesuai kebutuhan.</p>
                </div>
                    <div className='getHelp col-2 mt-4'>
                        <ul>
                        <h2>Follow Us</h2>
                            <li><i class='fab fa-facebook'></i> <a href='https://www.facebook.com/kompikomputer'>Facebook</a></li>
                	        <li><i class='fab fa-instagram'></i> <a href='https://www.instagram.com/kompikomputer'>Instagram</a></li>
                            <li><i class='fab fa-twitter'></i> <a href='https://www.twiter.com/kompikomputer'>Twitter</a></li>     
                            </ul>
                    </div>
                    <div className='link col-2 mt-4'>
                        <ul>
                        <h2>Subscribe</h2>
                        <p>Untuk mendapatkan informasi produk paling baru dan diskon.</p>
                            <p>
                            <div className='input-group'>
                            <input type='textarea' className='form-control' placeholder='Ketik Email Anda...' />
                            <span className='input-group-btn'>
                            <button className='btn btn-outline-light'> Send </button>
                            </span>
                            </div>
                            </p>
                        </ul>
                    </div>
                </div>
        )
    }
}

export default Footer