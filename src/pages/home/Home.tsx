import React from 'react';
import SigninForm from './SigninForm';

interface HomeProps {
}

const Home: React.FC<HomeProps> = () => {
    return (
        <div className="m-5 flex justify-center flex-col items-center">
            <h2 className="text-4xl font-bold">Cosumnes Oaks High School</h2>
            <h2 className="text-4xl font-bold">National Honor Society</h2>

            <SigninForm />
        </div>
    );
}

export default Home;
