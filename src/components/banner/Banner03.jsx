import React from 'react';
import { FreeMode, Thumbs, EffectCoverflow, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';


import shape1 from '../../assets/images/slider/slider-12.png'
import shape2 from '../../assets/images/slider/slider-13.png'
import shape3 from '../../assets/images/slider/slider-14.png'
import shape4 from '../../assets/images/slider/slider-15.png'
import { Link } from 'react-router-dom';


function Banner03(props) {
    const { data } = props;

    return (
        <section className="tf-slider">
            <div className="tf-container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="swiper-container slider-home-3">
                            <Swiper
                                style={{
                                    "--swiper-navigation-color": "#fff",
                                }}
                                loop={true}
                                effect={"coverflow"}
                                grabCursor={true}
                                centeredSlides={true}
                                spaceBetween={0}
                                slidesPerView={3}
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 15,
                                    depth: 320,
                                    modifier: 1,
                                    slideShadows: false,
                                }}
                                thumbs={{ swiper: null }}
                                modules={[Autoplay, FreeMode, Thumbs, EffectCoverflow]}
                                className="slider-thump"
                            >

                                {
                                    data.map(idx => (
                                        <SwiperSlide key={idx.id}>
                                            <img src={idx.img} alt="SplitingMe" />
                                        </SwiperSlide>
                                    ))
                                }

                            </Swiper>

                        </div>
                    </div>
                </div>

                <div className="tf-slider-item style-3">
                    <div className="content-inner">
                        <img src={shape1} alt="SplitingMe" className="img-star star-1 ani4" />
                        <img src={shape2} alt="SplitingMe" className="img-star star-2 ani5" />
                        <img src={shape3} alt="SplitingMe" className="img-star star-3 ani4" />
                        <img src={shape4} alt="SplitingMe" className="img-star star-4 ani5" />
                        <h1 className="heading">
                            Spliting Me
                        </h1>
                        <p className="sub-heading">Unlock the Benefits of Real Estate Investment with Just 1 Cent</p>
                        <div className="btn-slider ">
                            <Link to="/marketplace" className="tf-button style-6">Explore now</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Banner03;