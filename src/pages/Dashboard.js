import React from 'react';
import { Info, Repos, User, Search, Navbar } from '../components';
import loadingImage from '../images/preloader.gif';
import { useGlobalContext } from '../context/context';
import LoadingAnimation from '../components/LoadingAnimation';

const Dashboard = () => {
	const {loading} = useGlobalContext()

	if(loading){
		return(
			<main>
				<Navbar/>
				<Search/>
				<LoadingAnimation/>
			</main>
		)}

  return (
		<main>
			<Navbar/>
			<Search/>
			<Info />
			<User />
			<Repos/>
		</main>
	);
};

export default Dashboard;
