import React from 'react';
import styled from 'styled-components';
import {useGlobalContext } from '../context/context';
import {Pie3D, Line2D, Bar3D, Doughnut2D } from './Charts';


const Repos = () => {


  let currentYear = new Date().getFullYear();

  const { repos, commits} = useGlobalContext();




  const languages = repos.reduce((total, item) =>{
    const {language, stargazers_count}  = item
    //for pie3d and doughnut2d:
    if(!language) return total

    if (!total[language]){
      total[language] = { label: language, value: 1, stars: stargazers_count };
    }
    else{
      total[language] = {
				...total[language],
				value: total[language].value + 1,
				stars: total[language].stars + stargazers_count,
			};
    }
     
    return total  
  }, {})





  //most used
  const mostUsed = Object.values(languages).sort((a, b) =>{
    return b.value - a.value
  }).slice(0, 5)


  //most stars per language
  const mostPopular = Object.values(languages)
		.sort((a, b) => {
			return b.stars - a.stars;
		})
		.map((item) => {
			return { ...item, value: item.stars };
		})
		.slice(0, 5);

  //most forks
  const forks = repos
		.reduce((total, item) => {
			const { name, forks } = item;
			total[name] = {label: name, value: forks}
			return total;
		}, {})
	
  const mostForks = Object.values(forks)
		.sort((a, b) => {
			return b.value - a.value;
		}).slice(0, 5)
	

  //most stars per repo: most popular: use it to fetch activity of most popular repos
  // let stars = repos.reduce((total, item) =>{
  //   const {stargazers_count, name} = item
  //   total[stargazers_count] = {label: name, value: stargazers_count}
  //   return total
  // }, {})


  // stars = Object.values(stars).slice(-5).reverse()

  //console.log(stars)

  function getDayName(dateStr, locale){
      var date = new Date(dateStr);
      return date.toLocaleDateString(locale, { weekday: 'long' });        
  }



  let mostCommits = commits.reduce((total, item) =>{
		//trend activity
		let months = {
			"Monday": {value: 0},
			"Tuesday": {value: 0},
			"Wednesday": {value: 0},
			"Thursday": {value: 0},
			"Friday": {value: 0},
			"Saturday": {value: 0},
			"Sunday": {value: 0},
    };

  

		const { name, commits } = item;
    

		//get commits by month for each project
		let commitData = commits.reduce((total, item) => {
			const { commit } = item;
  
      
			let date = new Date(commit.author.date);

			const year = date.getFullYear();
			const day = getDayName(new Date(commit.author.date), "en-US");

			if (
				year === currentYear) {
				total[day] = total[day]
					? { value: total[day].value + 1 }
					: (total[day] = { value: 1 });
			}


			return total;
		}, {});

		//add collected commit data to months array
		for (const item in commitData) {
			months[item] = { value: commitData[item].value };
		}

		//use months with commit data for mostCommits

		total[name] = { seriesname: name, data: Object.values(months) };
   
		return total;
	}, {})

  

  mostCommits = Object.values(mostCommits).slice(0, 5)
  // console.log(mostCommits)
  return (
    <section className="section">
      <Wrapper className="section-center">
      <Pie3D data={mostUsed}/>
      <Line2D data={mostCommits}/>
      <Doughnut2D data={mostPopular}/>
      <Bar3D data={mostForks}/>
      </Wrapper>
    </section>
    );
}

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
