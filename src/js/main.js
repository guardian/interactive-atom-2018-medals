// javascript goes here
import axios from 'axios'
import orderBy from 'lodash/orderBy'
import Mustache from "mustache"

import leaderboardTop from "../templates/leaderBoardTop.html"
import leaderboardBottom from "../templates/leaderboardBottom.html"

// const fullBoardButton = document.querySelector('.expand-leaderboard');
// const rowHeaders = document.querySelectorAll('.row--header');

// const firstButton = document.querySelector('.item-button');
// const firstCategory = document.querySelector('.sports-category');
// const firstRowHeader = document.querySelector('.row--header');

// try {

// firstButton.className = 'item-button item-button--collapse';
// firstCategory.className = 'sports-category sports-category--show';
// firstRowHeader.className = 'row row--header row--header--open';

// } catch (err) {
// }



// fullBoardButton.addEventListener('click', () => {
// 	document.querySelector('.other-country-block').className = 'other-country-block';
// 	fullBoardButton.className = 'expand-leaderboard hidden';
// });

// rowHeaders.forEach(header => header.addEventListener('click', e => {
// 	const button = e.currentTarget.getElementsByTagName('button')[0];
// 	const selectedSportsCategory = header.nextElementSibling;
// 	const openSportsCategories = document.querySelectorAll('.sports-category--show');
// 	const collapseButtons = document.querySelectorAll('.item-button--collapse');

// 	if (button.className === 'item-button item-button--expand') {
// 		header.className = 'row row--header row--header--open row-with-border';
// 		firstRowHeader.className = 'row row--header row--header--open';
// 		button.className = ('item-button item-button--collapse');
// 		selectedSportsCategory.classList.remove('sports-category--hide');
// 		selectedSportsCategory.className = 'sports-category sports-category--show';
// 		openSportsCategories.forEach(category => category.className = 'sports-category sports-category--hide');
// 		collapseButtons.forEach(button => button.className = 'item-button item-button--expand');

// 	} else {
// 		header.className = 'row row--header row--header--closed row-with-border';
// 		firstRowHeader.className = 'row row--header';
// 		button.className = 'item-button item-button--expand';
// 		selectedSportsCategory.className = 'sports-category sports-category--hide';
// 	}
// }));

const score = country => Number(country.gold) + Number(country.silver/100) + Number(country.bronze/10000)

const rankReduce = (interm, cur, i, arr) => {

    if(interm.length === 0) { return [i] }

    const lastIndex = interm.slice(-1)[0]

    return score(cur) < score(arr[lastIndex]) ? interm.concat(i) : interm.concat(lastIndex)

}

function sortCountries(countries){

    countries = orderBy(countries, [ 'gold', 'silver', 'bronze' ], ['desc', 'desc', 'desc'])
    console.log('here', countries)
    var ranks = countries.reduce(rankReduce, []).map(i => i + 1)

    var sorted = countries.map( (c, i) => Object.assign({}, c, { rank : ranks[i] }))
        sorted = orderBy(sorted, [ 'rank', 'country' ], ['asc', 'asc'])

    return sorted
}


function init(){



	axios.get('https://interactive.guim.co.uk/docsdata-test/1PBYUvBmMRIcvqPEYSPgHQmSAtoCQBAjsGAVdnBvh-VA.json').then((resp) => {
		var sheets = resp.data.sheets;
        var allCountries = sheets.data;

        var countriesData = {};
        allCountries.forEach(c =>{
            countriesData[c.country] = c;
            c.gold = Number(c.gold);
            c.bronze = Number(c.bronze);
            c.silver = Number(c.silver);
            c.total = Number(c.total);
        })

        sheets.countries.forEach(c =>{
            if( !countriesData[c.country]){
                c.gold = c.silver = c.bronze = c.total = 0;
                allCountries.push(c);
            }

        })

        console.log(allCountries)
		var medalTable = sortCountries(allCountries)

		medalTable.forEach(c =>{
			c.goldList = new Array(Number(c.gold));
			c.silverList = new Array(Number(c.silver));
			c.bronzeList = new Array(Number(c.bronze));
	  
			c.abbreviation = sheets.countries.find(item => item.country === c.country).code.toLowerCase();
		  })
		  
		// render just the html for the blocks
		document.querySelector('.leaderboardTop').innerHTML = Mustache.render(leaderboardTop, {
			"otherCountries": medalTable.slice(3),
			"topCountries": medalTable.slice(0, 3),
			"secondTierCountries": [],
		}).replace(/<%= path %>/g, process.env.PATH)

		document.querySelector('.leaderboardBottom').innerHTML = Mustache.render(leaderboardBottom, {
			"otherCountries": medalTable.slice(3),
			"topCountries": medalTable.slice(0, 3),
			"secondTierCountries": [],
		}).replace(/<%= path %>/g, process.env.PATH)

		// inject that rendered html into the empty div we declared in main.html
		//document.querySelector(".interactive-blocks").innerHTML = html;
	});

   
}
init();