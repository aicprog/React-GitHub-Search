import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import mockCommits from './mockData.js/mockCommits';
import axios from 'axios';

const rootUrl = 'https://api.github.com';


//create the context: gives access to provider and consumer

const GithubContext = React.createContext()

//provider, consumer. To access: GithubContext.Provider
//Don't need consumer because of useContext hook

const getStoredUser = () =>{
	let githubUserName = "aicprog"

	if(localStorage.getItem('githubUserName')){
		githubUserName = localStorage.getItem("githubUserName");
	}

	return githubUserName
}


//include {children} so you can render whatever you wrap GithubProvider with. In this case, it will be the whole application

const GithubProvider = ({children}) =>{
	//state variables
	const [githubUser, setGithubUser] = useState([]);
	const [repos, setRepos] = useState([]);
	const [followers, setFollowers] = useState([]);
	const [commits, setCommits] = useState([]);
	// const [week, setWeek] = useState(null)


	//request loading
	const [requests, setRequests] = useState(0);
	const [loading, setLoading] = useState(false);
	//error
	const [error, setError] = useState({ show: false, msg: "" });

	

	React.useEffect(() => {
		searchGithubUser(getStoredUser());
	}, []);

	const startingWeekDate = (number) =>{
		let today = new Date();
		const startingDate = new Date(
			today.setDate(today.getDate() - today.getDay() - (number))
		);
		
		      
		return startingDate;    
	}

    //search users
    const searchGithubUser = async (user)=>{
		const startingDate = startingWeekDate(1).toISOString().slice(0, 10);
		// setWeek(startingDate.toISOString().slice(0, 10));
        //toggle Error
        toggleError();
        //set loading to true
        setLoading(true)



		const response = await axios(`${rootUrl}/users/${user}`).catch((error) =>{
			console.log(error)
		})
		

		if(response){
			//change key so most currently searched user will be stored
			localStorage.setItem("githubUserName", user);

			setGithubUser(response.data);
			//reset commit so it can get incoming data
			setCommits([]);
			const { followers_url, repos_url } = response.data;

			await Promise.allSettled([
				axios(`${repos_url}?sort=pushed&order=desc`),
				axios(`${followers_url}?per_page=100`),
			])
				.then((results) => {
					console.log(results);
					const [repos, followers] = results;
					const status = "fulfilled";

					if (repos.status === status) {
						let data = repos.value.data;
						setRepos(data);

						//commitz
						for (const index in data.slice(0, 3)) {
							const { full_name, name } = data[index];

							const url = `${rootUrl}/repos/${full_name}/commits?since=${startingDate}&per_page=100`;
							console.log(url);
							axios(`${url}`).then(({ data }) => {
								// console.log(data);
								setCommits((oldArray) => {
									return [...oldArray, { name, commits: data }];
								});

							});
						}
					}

					if (followers.status === status) {
						setFollowers(followers.value.data);
					}
				})
				.catch((error) => console.log(error));
		}else{
			toggleError(true, "There is no user with that username");
		}

		checkRequests();
		setLoading(false);

    }


	//check rate
	const checkRequests = () => {
		axios(`${rootUrl}/rate_limit`)
			.then(({ data }) => {
				let {
					rate: { remaining, limit },
				} = data;
				setRequests({ remaining, limit });

				if (remaining === 0) {
					//throw an error
                    toggleError(true, 'sorry, you have exceeded your hourly rate limit!')
				}
			})
			.catch((error) => console.log(error));
	};

    //for error
    function toggleError (show= false, msg= ""){
        setError({show, msg})
    }

	useEffect(checkRequests, [githubUser]);

	return (
		<GithubContext.Provider
			value={{
				githubUser,
				repos,
				followers,
				commits,
				requests,
				error,
				searchGithubUser,
				loading,
				startingWeekDate
			}}
		>
			{children}
		</GithubContext.Provider>
	);
}

//export so you don't have to directly import and instantiate createContext()
export const useGlobalContext = () => {
	return React.useContext(GithubContext);
};


export {GithubProvider, GithubContext}