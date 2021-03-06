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


//include {children} so you can render whatever you wrap GithubProvider with. In this case, it will be the whole application

const GithubProvider = ({children}) =>{
	//state variables
	const [githubUser, setGithubUser] = useState(mockUser);
	const [repos, setRepos] = useState(mockRepos);
	const [followers, setFollowers] = useState(mockFollowers);
	const [commits, setCommits] = useState(mockCommits);
	const [week, setWeek] = useState(null)

	//request loading
	const [requests, setRequests] = useState(0);
	const [loading, setLoading] = useState(false);
	//error
	const [error, setError] = useState({ show: false, msg: "" });

	

	React.useEffect(() => {
		const startingDate = startingWeekDate(1);
		setWeek(startingDate.toISOString().slice(0, 10));
		// console.log(lastSunday)
		// if(day === "Sunday"){
		// 	setWeek(currentWeek.toISOString().slice(0, 10))
		// }else{

		//}
	}, [commits]);

	const startingWeekDate = (number) =>{
		let today = new Date();
		const startingDate = new Date(
			today.setDate(today.getDate() - today.getDay() - (number))
		);
		
		      
		return startingDate;    
	}

    //search users
    const searchGithubUser = (user)=>{
        //toggle Error
        toggleError();
        //set loading to true
        setLoading(true)
        axios(`${rootUrl}/users/${user}`)
        .then(({data})=>{
					setGithubUser(data);

					//reset commits to new data
					//reset commit so it can get incoming data
					setCommits([]);

					const { followers_url, repos_url } = data;

					//https://api.github.com/users/krishnaik06/repos?sort=created&order=desc&per_page=5
					//repos
					axios(`${repos_url}?sort=pushed&order=desc`).then(({ data }) => {
						setRepos(data);
						// console.log(`${repos_url}?sort=pushed&order=desc`);

						//commitz
						for (const index in data.slice(0, 3)) {
							const { full_name, name } = data[index];

							const url = `${rootUrl}/repos/${full_name}/commits?since=${week}&per_page=100`;
							console.log(url);
							axios(`${url}`).then(({ data }) => {
								// console.log(data);
								setCommits((oldArray) => {
									
									return [...oldArray, { name, commits: data }];
								});
								// setCommits([...commits, { name, commits: data }]);
								
								
								// }
							});
						}
					});

					//followers
					axios(`${followers_url}?per_page=100`).then(({ data }) => {
						setFollowers(data);
					});
				})
        .catch((error) =>{
             console.log(error)
             toggleError(true, "There is no user with that username")
        })
		checkRequests();
		setLoading(false);
        // console.log(user)
		// console.log(commits);

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
				week, startingWeekDate
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