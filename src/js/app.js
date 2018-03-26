// javascript goes here
import axios from 'axios'

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

function sortCountries(countries){


    const ranks = countries.reduce(rankReduce, []).map(i => i + 1)

    const sorted = _(countries).map( (c, i) => Object.assign({}, c, { rank : ranks[i] }))
        .orderBy([ 'rank', 'country' ], ['asc', 'asc'])
        .valueOf()

    return sorted
}


function init(){



	axios.get('https://interactive.guim.co.uk/docsdata-test/1PBYUvBmMRIcvqPEYSPgHQmSAtoCQBAjsGAVdnBvh-VA.json').then((resp) => {
		var sheets = resp.data.sheets;

		var medalTable = sortCountries(sheets.data)


		medalTable.forEach(c =>{
			c.goldList = new Array(Number(c.gold));
			c.silverList = new Array(Number(c.silver));
			c.bronzeList = new Array(Number(c.bronze));
	  
			c.abbreviation = doc.sheets.ioc_lookup.find(item => item.country === c.country).ioc.toLowerCase();
		  })
		  
		// render just the html for the blocks
		var html = Mustache.render(leaderboardTop, {
			"otherCountries": medalTable.slice(6),
			"topCountries": medalTable.slice(0, 6),
			"secondTierCountries": [],
		}) 

		// inject that rendered html into the empty div we declared in main.html
		//document.querySelector(".interactive-blocks").innerHTML = html;
	});

   
}