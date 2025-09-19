import React from 'react'
import logo from '../../src/assets/images/nexora.png';

const Hero = () => {
    return (

        <div className="flex py-2 lg:py-6">
            <div className="hidden lg:mt-0 lg:col-span-4 lg:flex mr-5">
                {/* <img src={logo} alt='logo' className='w-40 h-40' /> */}
            </div>
            <div className="mr-auto place-self-center lg:col-span-8 flex justify-between w-full">
                <div>
                    <h1 className="max-w-2xl mb-4 text-3xl tracking-tight leading-none md:text-3xl xl:text-3xl ">See EU Funded</h1>
                    <h3 className="max-w-2xl mb-4 text-2xl tracking-tight leading-none md:text-3xl xl:text-3xl ">Make better decisions, faster</h3>
                    <p className="max-w-2xl mb-4 font-light text-gray-500 md:text-lg lg:text-xl 400">
                        Discover and act on private market activity with <br /> predictive company intelligence.
                    </p>
                </div>
                <div>
                    <p>Number of the all Projects: ???</p>
                    <p>Number of the signed Projects: ???</p>
                    <p>Number of the terminated Projects: ???</p>
                    <p>Number of the closed Projects: ???</p>
                    <p>or some useful statistics !!!!</p>
                </div>
            </div>
        </div>

    )
}

export default Hero
