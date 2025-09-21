import Category from './Category';

const Nav = () => {

    return (
        <>
            <div className='pb-4 fixed top-1 w-full border-b-2 border-gray-400 bg-white z-40'>
                <Category className="mb-11" />
            </div>
            {/* <SearchAndFilter /> */}
        </>
    )
}

export default Nav

