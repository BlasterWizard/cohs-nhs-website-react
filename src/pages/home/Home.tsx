import React from 'react';
import SigninForm from './SigninForm';

interface HomeProps {
}

const Home: React.FC<HomeProps> = () => {
    return (
        <div className="m-5 flex justify-center flex-col items-center">
            <h2 className="text-4xl font-bold">Cosumnes Oaks High School</h2>
            <h2 className="text-4xl font-bold">National Honor Society</h2>

            <p className="p-3 bg-white/60 rounded-2xl mt-5 text-center">For best viewing experience, please log in with a laptop or computer. The site is not yet optimized for mobile.</p>
            <SigninForm />
        </div>
    );
}

export default Home;
