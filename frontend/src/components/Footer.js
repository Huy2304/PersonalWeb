import React from 'react';
import './Footer.css'; // CSS riêng cho footer

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-about">
                    <h3>HuyGa Blog</h3>
                    <p>Chia sẻ kiến thức về lập trình, công nghệ và cuộc sống.</p>
                </div>

                <div className="footer-links">
                    <h4>Liên kết</h4>
                    <ul>
                        <li><a href="/about">Giới thiệu</a></li>
                        <li><a href="/posts">Bài viết</a></li>
                        <li><a href="/contact">Liên hệ</a></li>
                    </ul>
                </div>

                <div className="footer-social">
                    <h4>Kết nối</h4>
                    <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                    <li><a href="https://github.com/Huy2304/" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                    <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} HuyGa Blog. All rights reserved.</p>
            </div>
        </footer>
    );
};
export default Footer;