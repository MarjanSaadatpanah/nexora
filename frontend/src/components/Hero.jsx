import React from 'react'
import logo from '../../src/assets/images/hero2.png';

const Hero = () => {
    return (
        <section className=" 0">
            <div className="grid max-w-screen-xl px-4 py-2 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                <div className="mr-auto place-self-center lg:col-span-8">
                    <h1 className="max-w-2xl mb-4 text-4xl tracking-tight leading-none md:text-5xl xl:text-6xl ">See EU Funded</h1>
                    <h3 className="max-w-2xl mb-4 text-2xl tracking-tight leading-none md:text-3xl xl:text-4xl ">Make better decisions, faster</h3>
                    <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl 400">Discover and act on private market activity with predictive company intelligence.</p>

                    {/* <a href='/' className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
                        Speak to Sales
                    </a> */}
                </div>
                <div className="hidden lg:mt-0 lg:col-span-4 lg:flex">
                    <img src={logo} alt='logo' />
                </div>
            </div>
        </section>
    )
}

export default Hero
